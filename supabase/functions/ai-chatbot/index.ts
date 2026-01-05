import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not set");
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
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
            ...messages.slice(-10), // Keep last 10 messages for context
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

    const data = await response.json();
    const assistantResponse =
      data.choices?.[0]?.message?.content ||
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
        error: error instanceof Error ? error.message : "Unknown error",
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
