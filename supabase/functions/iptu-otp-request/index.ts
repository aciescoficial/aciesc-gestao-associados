/**
 * iptu-otp-request
 *
 * Portão de acesso ao login por OTP. NÃO exige JWT (usuário ainda não logado).
 *
 * Fluxo:
 *   1. Recebe { email }
 *   2. Consulta o Higestor AO VIVO — só prossegue se o e-mail pertencer a um
 *      contribuinte ATIVO e (associado OU filiado)
 *   3. Provisiona/atualiza a conta no Supabase (e-mail confirmado, nome e CPF
 *      vindos do Higestor, role "user")
 *   4. Retorna { ok: true } — o frontend então chama supabase.auth.signInWithOtp
 *      ({ shouldCreateUser: false }) e o Supabase envia o código por e-mail.
 *
 * Como contas só são criadas aqui (signup público DEVE estar desativado no
 * Supabase Auth), apenas associados ativos no Higestor conseguem receber código.
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-application-name",
};

const HIGESTOR_BASE = Deno.env.get("HIGESTOR_API_URL") ?? "https://app.higestor.com.br/api";
const HIGESTOR_TOKEN = Deno.env.get("HIGESTOR_API_TOKEN") ?? "zd_CS-9zRVGz8U_sGgzx";

interface HigestorContribuinte {
  ativo: boolean;
  associado: boolean;
  filiado: boolean;
  nome: string | null;
  razao_social: string;
  cpf_cnpj: string;
  email: string;
}

/**
 * Avalia o acesso de um e-mail no Higestor, distinguindo 3 situações:
 *   - "valido"        → contribuinte ATIVO e (associado ou filiado) → libera
 *   - "inadimplente"  → tem cadastro, mas não está ativo/adimplente → regularizar
 *   - "nao_associado" → e-mail não encontrado no Higestor → virar associado
 */
type AvaliacaoAcesso =
  | { status: "valido"; contribuinte: HigestorContribuinte }
  | { status: "inadimplente" }
  | { status: "nao_associado" };

async function avaliarAcesso(email: string): Promise<AvaliacaoAcesso> {
  const url = new URL(`${HIGESTOR_BASE}/contribuintes`);
  url.searchParams.set("filter[email]", email);
  url.searchParams.set("page[limit]", "20");

  const res = await fetch(url.toString(), {
    headers: {
      "Auth-Token": HIGESTOR_TOKEN,
      // JSON:API estrito — qualquer outro Accept resulta em 406
      "Accept": "application/vnd.api+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Higestor retornou ${res.status} ao buscar e-mail`);
  }

  const json = await res.json();
  const list: Array<{ attributes: HigestorContribuinte }> = Array.isArray(json?.data)
    ? json.data
    : [];

  // Sem nenhum registro com esse e-mail → não é associado
  if (list.length === 0) {
    return { status: "nao_associado" };
  }

  // Tem cadastro: procura um vínculo ativo e adimplente
  const match = list.find(
    (r) => r.attributes?.ativo === true &&
      (r.attributes?.associado === true || r.attributes?.filiado === true)
  );

  if (match) {
    return { status: "valido", contribuinte: match.attributes };
  }

  // Tem cadastro mas nenhum vínculo ativo → inadimplente/inativo
  return { status: "inadimplente" };
}

// Link de inscrição de novo associado na ACIESC (Higestor)
const HIGESTOR_INSCRICAO_URL =
  "https://app.higestor.com.br/inscricao/associado/aciesc-097ed8b6-35f4-4159-baf1-2d5e7cf426d3";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Informe um e-mail válido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Valida no Higestor ao vivo
    let avaliacao: AvaliacaoAcesso;
    try {
      avaliacao = await avaliarAcesso(email);
    } catch (err) {
      console.error("Erro Higestor:", err);
      return new Response(
        JSON.stringify({ error: "Não foi possível validar seu cadastro agora. Tente novamente em instantes." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Tem cadastro mas está inadimplente/inativo → orienta a regularizar
    if (avaliacao.status === "inadimplente") {
      return new Response(
        JSON.stringify({
          code: "inadimplente",
          error: "Por Favor! Regularize o seu pagamento para ter acesso!",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Não é associado → orienta a se inscrever (com link)
    if (avaliacao.status === "nao_associado") {
      return new Response(
        JSON.stringify({
          code: "nao_associado",
          error: "Para acessar você precisa ser um Associado da ACIESC!",
          cta: "Clique aqui e seja um associado agora mesmo",
          signup_url: HIGESTOR_INSCRICAO_URL,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contribuinte = avaliacao.contribuinte;
    const nome = contribuinte.nome ?? contribuinte.razao_social;
    const cpf = contribuinte.cpf_cnpj;

    // 2. Provisiona/atualiza a conta no Supabase
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Já existe perfil para este e-mail? (service role ignora RLS)
    const { data: existing } = await admin
      .from("user")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Atualiza dados-espelho do Higestor e garante ativo
      await admin
        .from("user")
        .update({ cpf, name: nome, active: true })
        .eq("id", existing.id);
    } else {
      // Cria via admin API (gera tokens corretos, e-mail já confirmado)
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name: nome, role: "user" },
      });

      if (createErr || !created?.user) {
        console.error("Erro ao criar usuário:", createErr);
        return new Response(
          JSON.stringify({ error: "Falha ao preparar seu acesso. Tente novamente." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Trigger handle_new_user já criou public.user; preenche CPF
      await admin
        .from("user")
        .update({ cpf, name: nome, active: true })
        .eq("id", created.user.id);
    }

    // 3. OK — frontend agora dispara o envio do código
    return new Response(
      JSON.stringify({ ok: true, nome }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("iptu-otp-request error:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
