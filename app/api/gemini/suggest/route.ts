import { NextRequest, NextResponse } from 'next/server';

interface SuggestRequestPayload {
  customerName: string;
  lastCustomerMessage: string;
  messages: Array<{
    sender: 'admin' | 'customer';
    text: string;
  }>;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SuggestRequestPayload = await req.json();
    const { customerName, lastCustomerMessage, messages, apiKey } = body;

    const effectiveApiKey =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
      process.env.GOOGLE_API_KEY?.trim();

    const systemPrompt = `You are an AI customer support assistant for "Nordic Furniture / Merchly", a modern Scandinavian retail furniture brand.
Your goal is to draft a professional, warm, empathetic, and solution-oriented reply for the store agent (Raihan Fahreza) to send to customer "${customerName}".

Guidelines:
1. Be polite, clear, and reassuring.
2. If the customer reported a damaged/scratched item, apologize warmly and offer solutions (e.g. tabletop replacement or courtesy credit).
3. If they asked for tracking or shipping, provide helpful status details.
4. If they asked to change delivery address, confirm willingness to update before departure.
5. Keep the draft concise (1 to 3 sentences). Match the language of the customer (English or Indonesian).
6. DO NOT include quotes or prefixes like "Support:". Output ONLY the draft reply text.`;

    let suggestion = '';
    let isLiveGemini = false;

    if (effectiveApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;

        const contents = [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nRecent chat messages:\n${messages
              .slice(-6)
              .map((m) => `${m.sender === 'admin' ? 'Support Agent' : customerName}: ${m.text}`)
              .join('\n')}\n\nDraft a helpful response for the support agent:` }],
          },
        ];

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            suggestion = candidateText.trim().replace(/^["']|["']$/g, '');
            isLiveGemini = true;
          }
        }
      } catch (err) {
        console.warn('Gemini suggest error:', err);
      }
    }

    if (!suggestion) {
      // Smart contextual fallback
      const text = (lastCustomerMessage || '').toLowerCase();
      if (text.includes('scratch') || text.includes('damage') || text.includes('replacement') || text.includes('refund')) {
        suggestion = `Hi ${customerName}, I am really sorry for the scratch on your table! I have notified our warehouse quality team. Would you prefer a free replacement tabletop shipped today, or a 20% courtesy credit to your original payment?`;
      } else if (text.includes('shipped') || text.includes('track') || text.includes('order')) {
        suggestion = `Hi ${customerName}! Your order has been packed and handed over to DHL Express. Tracking code: DHL-9837124567. Estimated delivery is within 2-3 business days!`;
      } else if (text.includes('address') || text.includes('change')) {
        suggestion = `Hi ${customerName}! Yes, your shipment has not left our fulfillment hub yet. Please send over your new delivery address and I will update the shipping label right away.`;
      } else {
        suggestion = `Hello ${customerName}! Thank you for reaching out to Nordic Furniture support. We are checking your details right away and will provide a resolution within 10 minutes.`;
      }
    }

    return NextResponse.json({
      success: true,
      suggestion,
      isLiveGemini,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
