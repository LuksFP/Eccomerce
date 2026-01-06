import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um assistente virtual amigável e prestativo de uma loja online de eletrônicos e acessórios premium. Seu nome é "Assistente Virtual".

Suas responsabilidades:
1. Ajudar clientes com dúvidas sobre produtos, pedidos, entregas e pagamentos
2. Fornecer informações sobre políticas da loja (trocas, devoluções, garantia)
3. Auxiliar na navegação do site e funcionalidades
4. Ser educado, objetivo e resolver problemas rapidamente

Informações da loja:
- Entregamos em todo o Brasil
- Frete grátis para compras acima de R$ 299
- Prazo de entrega: 3-5 dias úteis (capitais), 5-10 dias úteis (outras regiões)
- Parcelamento em até 12x sem juros no cartão
- Aceitamos PIX, cartão de crédito, débito e boleto
- Troca/devolução em até 7 dias após recebimento
- Garantia de 12 meses em todos os produtos

Diretrizes:
- Responda sempre em português brasileiro
- Seja conciso mas completo
- Use emojis com moderação para ser mais amigável
- Se não souber algo específico, sugira contato com o suporte humano
- Nunca invente informações sobre pedidos específicos do cliente`;

// Input validation constants
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_PAYLOAD_SIZE = 10000;

type ChatMessage = {
  role: string;
  content: string;
};

function validateMessages(messages: unknown): { valid: boolean; error?: string; sanitized?: ChatMessage[] } {
  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }

  if (messages.length === 0) {
    return { valid: false, error: "Messages array cannot be empty" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }

  const sanitized: ChatMessage[] = [];

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: "Invalid message format" };
    }

    if (!msg.role || !msg.content) {
      return { valid: false, error: "Each message must have role and content" };
    }

    if (typeof msg.content !== "string") {
      return { valid: false, error: "Message content must be a string" };
    }

    if (msg.role !== "user" && msg.role !== "assistant") {
      return { valid: false, error: "Invalid message role" };
    }

    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` };
    }

    // Sanitize content - remove control characters
    const sanitizedContent = msg.content.replace(/[\x00-\x1F\x7F]/g, "").trim();
    
    if (!sanitizedContent) {
      return { valid: false, error: "Message content cannot be empty" };
    }

    sanitized.push({
      role: msg.role,
      content: sanitizedContent,
    });
  }

  // Check total payload size
  const totalSize = JSON.stringify(sanitized).length;
  if (totalSize > MAX_TOTAL_PAYLOAD_SIZE) {
    return { valid: false, error: "Total message size too large" };
  }

  return { valid: true, sanitized };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabase.auth.getClaims(token);
    
    if (authError || !data?.claims) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not set");
    }

    const body = await req.json();
    const { messages } = body;

    // Validate and sanitize messages
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...validation.sanitized!.slice(-10), // Keep last 10 messages for context
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("AI Gateway error:", error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const assistantResponse =
      aiData.choices?.[0]?.message?.content ||
      "Desculpe, não consegui processar sua mensagem.";

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-chatbot function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        response:
          "Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes ou entre em contato com nosso suporte.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
