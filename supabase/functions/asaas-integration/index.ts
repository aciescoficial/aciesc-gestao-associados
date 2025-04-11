
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Base URL for Asaas API
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");

interface PaymentRequest {
  customerId: string;
  associationTypeId: string;
  billingType: string;
  value: number;
  dueDate: string;
  description: string;
  installmentCount?: number;
  installmentValue?: number;
}

interface CustomerRequest {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
}

interface PaymentLinkRequest {
  name: string;
  description: string;
  value: number;
  billingType: string;
  chargeType: string;
  dueDateLimitDays?: number;
  subscriptionCycle?: string;
  maxInstallmentCount?: number;
}

async function createCustomer(data: CustomerRequest) {
  const response = await fetch(`${ASAAS_API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create customer: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createPayment(data: PaymentRequest) {
  const paymentData = {
    customer: data.customerId,
    billingType: data.billingType,
    value: data.value,
    dueDate: data.dueDate,
    description: data.description,
    installmentCount: data.installmentCount,
    installmentValue: data.installmentValue,
  };

  const response = await fetch(`${ASAAS_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create payment: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createPaymentLink(data: PaymentLinkRequest) {
  const response = await fetch(`${ASAAS_API_URL}/paymentLinks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      value: data.value,
      billingType: data.billingType,
      chargeType: data.chargeType,
      dueDateLimitDays: data.dueDateLimitDays || 5,
      subscriptionCycle: data.subscriptionCycle,
      maxInstallmentCount: data.maxInstallmentCount
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create payment link: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createSubscription(data: any) {
  const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create subscription: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function handleWebhook(req: Request) {
  const data = await req.json();
  
  console.log("Received webhook from Asaas:", data);
  
  // Process the webhook data
  // Update subscription status in the database
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Handle different endpoints
    if (path === "create-customer") {
      const data = await req.json();
      const result = await createCustomer(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "create-payment") {
      const data = await req.json();
      const result = await createPayment(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "create-payment-link") {
      const data = await req.json();
      const result = await createPaymentLink(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "create-subscription") {
      const data = await req.json();
      const result = await createSubscription(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "webhook") {
      return handleWebhook(req);
    } else {
      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
