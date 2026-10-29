/**
 * higestor-validator
 *
 * Consulta a API do Higestor (https://app.higestor.com.br/api/) para validar
 * se um contribuinte está ativo/associado na ACIESC.
 *
 * Endpoints suportados:
 *   GET ?id=<higestor_id>           → busca por ID do contribuinte
 *   GET ?cpf_cnpj=<cpf_ou_cnpj>    → busca por CPF/CNPJ (exact match)
 *   GET ?email=<email>              → busca por e-mail (exact match)
 *   GET ?razao_social=<nome>        → busca por razão social (partial match)
 *
 * Retorna:
 *   { valid: boolean, contribuinte?: ContribuinteInfo, error?: string }
 *
 * Acesso: admin e diretoria apenas.
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

// ── tipos ──────────────────────────────────────────────────────────────────

interface HigestorAttributes {
  nome: string | null;
  razao_social: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  celular: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  associado: boolean;
  associado_registro: string | null;
  associado_data_registro: string | null;
  associado_data_baixa: string | null;
  filiado: boolean;
  filiado_registro: string | null;
  filiado_data_registro: string | null;
  campos_personalizados: Record<string, unknown>;
}

interface HigestorResource {
  id: string;
  type: string;
  attributes: HigestorAttributes;
}

interface HigestorResponse {
  data: HigestorResource | HigestorResource[];
  links?: { first?: string; last?: string; next?: string; previous?: string };
}

interface ContribuinteInfo {
  id: string;
  nome: string;
  cpf_cnpj: string;
  email: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  associado: boolean;
  filiado: boolean;
  associado_desde: string | null;
  associado_baixa: string | null;
  /** true se ativo=true E (associado=true OU filiado=true) */
  valido: boolean;
  motivo_invalido: string | null;
}

// ── helpers Higestor ───────────────────────────────────────────────────────

function higestorHeaders(): Record<string, string> {
  return {
    "Auth-Token": HIGESTOR_TOKEN,
    // A API do Higestor (JSON:API estrito) rejeita com 406 qualquer outro Accept
    "Accept": "application/vnd.api+json",
  };
}

/** Converte um recurso JSON:API em ContribuinteInfo normalizado */
function normalize(resource: HigestorResource): ContribuinteInfo {
  const a = resource.attributes;
  const valido = a.ativo === true && (a.associado === true || a.filiado === true);

  let motivo_invalido: string | null = null;
  if (!a.ativo) {
    motivo_invalido = "Contribuinte inativo no Higestor.";
  } else if (!a.associado && !a.filiado) {
    motivo_invalido = "Contribuinte não possui vínculo ativo de associado ou filiado.";
  } else if (a.associado && a.associado_data_baixa && a.associado_data_baixa !== "0000-00-00") {
    // Se tem data de baixa no futuro/passado e ativo=false já coberto acima
    motivo_invalido = `Associação encerrada em ${a.associado_data_baixa}.`;
  }

  return {
    id: resource.id,
    nome: a.nome ?? a.razao_social,
    cpf_cnpj: a.cpf_cnpj,
    email: a.email,
    cidade: a.cidade,
    uf: a.uf,
    ativo: a.ativo,
    associado: a.associado,
    filiado: a.filiado,
    associado_desde: a.associado_data_registro ?? null,
    associado_baixa: a.associado_data_baixa ?? null,
    valido,
    motivo_invalido: valido ? null : motivo_invalido,
  };
}

/** Busca por ID direto */
async function buscarPorId(id: string): Promise<ContribuinteInfo | null> {
  const res = await fetch(`${HIGESTOR_BASE}/contribuintes/${id}`, {
    headers: higestorHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Higestor retornou ${res.status} ao buscar id=${id}`);
  const json: HigestorResponse = await res.json();
  const resource = Array.isArray(json.data) ? json.data[0] : json.data;
  if (!resource) return null;
  return normalize(resource);
}

/** Formata CPF (11 dígitos) ou CNPJ (14 dígitos) no padrão aceito pelo filtro do Higestor */
function formatCpfCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return raw; // tamanho inesperado → envia como veio
}

/** Busca por filtro (cpf_cnpj, email, razao_social) */
async function buscarPorFiltro(
  campo: "cpf_cnpj" | "email" | "razao_social",
  valor: string
): Promise<ContribuinteInfo[]> {
  const url = new URL(`${HIGESTOR_BASE}/contribuintes`);
  url.searchParams.set(`filter[${campo}]`, valor);
  url.searchParams.set("page[limit]", "10");

  const res = await fetch(url.toString(), { headers: higestorHeaders() });
  if (!res.ok) throw new Error(`Higestor retornou ${res.status} ao filtrar por ${campo}`);
  const json: HigestorResponse = await res.json();
  const list = Array.isArray(json.data) ? json.data : json.data ? [json.data] : [];
  return list.map(normalize);
}

// ── handler principal ──────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar JWT e role
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: userData } = await serviceClient
      .from("user")
      .select("role")
      .eq("id", user.id)
      .single();

    // Apenas admin e diretoria podem consultar diretamente o Higestor
    const allowedRoles = ["admin", "diretoria"];
    if (!userData || !allowedRoles.includes(userData.role)) {
      return new Response(
        JSON.stringify({ error: "Acesso restrito a administradores." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!HIGESTOR_TOKEN) {
      return new Response(
        JSON.stringify({ error: "HIGESTOR_API_TOKEN não configurado." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const cpf_cnpj = url.searchParams.get("cpf_cnpj");
    const email = url.searchParams.get("email");
    const razao_social = url.searchParams.get("razao_social");

    if (!id && !cpf_cnpj && !email && !razao_social) {
      return new Response(
        JSON.stringify({ error: "Informe id, cpf_cnpj, email ou razao_social." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: ContribuinteInfo | ContribuinteInfo[] | null = null;

    if (id) {
      result = await buscarPorId(id);
      if (!result) {
        return new Response(
          JSON.stringify({ valid: false, error: "Contribuinte não encontrado no Higestor." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ valid: result.valido, contribuinte: result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (cpf_cnpj) {
      // O filtro do Higestor só casa com o documento formatado (testado em 2026-06)
      const list = await buscarPorFiltro("cpf_cnpj", formatCpfCnpj(cpf_cnpj));
      result = list;
    } else if (email) {
      result = await buscarPorFiltro("email", email);
    } else if (razao_social) {
      result = await buscarPorFiltro("razao_social", razao_social);
    }

    return new Response(
      JSON.stringify({ count: (result as ContribuinteInfo[]).length, contribuintes: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("higestor-validator error:", err);
    return new Response(
      JSON.stringify({ error: "Erro ao consultar Higestor. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
