import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestPayload {
  customerName: string;
  customerId?: string;
  customerContext?: string;
  messages: Array<{
    sender: 'admin' | 'customer';
    text: string;
  }>;
  latestMessage: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestPayload = await req.json();
    const { customerName, customerContext, messages, latestMessage, apiKey } = body;

    const effectiveApiKey =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
      process.env.GOOGLE_API_KEY?.trim();

    // Prepare system prompt for Gemini to act as the specific customer
    const systemPrompt = `You are roleplaying as the customer "${customerName}" communicating with a retail e-commerce store support agent (Nordic Furniture / Merchly).
Customer Context: ${customerContext || 'A customer who recently purchased furniture online.'}

Task: Respond to the store agent's latest message naturally as the customer.
Guidelines:
1. Speak in the first person ("I", "my") as the customer.
2. Keep the response concise, realistic, and human (1 to 3 sentences).
3. Match the language used by the agent (English or Indonesian).
4. Be polite but stay in character (e.g. if you asked for a replacement or tracking update, react naturally to what the agent offered).
5. DO NOT prefix your response with "Customer:", quotes, or meta commentary. Output ONLY the raw message text.`;

    let reply = '';
    let isLiveGemini = false;

    if (effectiveApiKey) {
      try {
        // Try calling Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;

        // Format conversation history for Gemini API
        const contents = [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nHere is the previous conversation history:\n${messages
              .slice(-6)
              .map((m) => `${m.sender === 'admin' ? 'Store Agent' : customerName}: ${m.text}`)
              .join('\n')}\n\nStore Agent's latest message to you:\n"${latestMessage}"\n\nYour response as ${customerName}:` }],
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
          const candidateText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            reply = candidateText.trim().replace(/^["']|["']$/g, '');
            isLiveGemini = true;
          }
        } else {
          const errText = await response.text();
          console.warn('Gemini API call returned non-200:', response.status, errText);
        }
      } catch (geminiError) {
        console.warn('Gemini API network error, using contextual fallback engine:', geminiError);
      }
    }

    // Contextual Fallback Engine if Gemini API is not configured or failed
    if (!reply) {
      reply = generateContextualCustomerReply(customerName, latestMessage, messages);
    }

    return NextResponse.json({
      success: true,
      reply,
      isLiveGemini,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

function generateContextualCustomerReply(
  customerName: string,
  latestMessage: string,
  history: Array<{ sender: string; text: string }>
): string {
  const msgLower = latestMessage.toLowerCase();

  // 1. Alex Johnson (reported scratch / replacement)
  if (customerName.toLowerCase().includes('alex')) {
    if (msgLower.includes('replacement') || msgLower.includes('new tabletop') || msgLower.includes('ship')) {
      return "That sounds wonderful! I would really prefer a brand new tabletop replacement if possible. Thank you so much for the quick help!";
    }
    if (msgLower.includes('credit') || msgLower.includes('refund') || msgLower.includes('20%')) {
      return "Thank you for the option! A replacement would be ideal, but if that takes too long, I can accept the credit. How soon can you ship the replacement?";
    }
    if (msgLower.includes('photo') || msgLower.includes('picture')) {
      return "I already attached the photos above showing the scratch near the edge. Let me know if you need more angles!";
    }
    if (msgLower.includes('check') || msgLower.includes('wait') || msgLower.includes('fulfillment')) {
      return "Understood, thank you. I'll wait for your update here. Appreciate your quick response!";
    }
    if (msgLower.includes('halo') || msgLower.includes('hi') || msgLower.includes('hello')) {
      return "Hello! Thanks for getting back to me. Any update on my dining table request?";
    }
    return "Thank you for getting back to me! Please keep me updated on the resolution.";
  }

  // 2. James Carter (Order #T0142 tracking / Sapporo Sofa)
  if (customerName.toLowerCase().includes('james')) {
    if (msgLower.includes('track') || msgLower.includes('dhl') || msgLower.includes('shipped')) {
      return "Awesome, got the tracking details! I'll keep an eye on DHL Express. Thanks for checking so quickly!";
    }
    if (msgLower.includes('wait') || msgLower.includes('check')) {
      return "Sounds good, thanks James! Just let me know once you have the tracking number.";
    }
    return "Great, thank you for confirming! I really appreciate the prompt assistance.";
  }

  // 3. Olivia Martinez (Order #B0991 change delivery address)
  if (customerName.toLowerCase().includes('olivia')) {
    if (msgLower.includes('address') || msgLower.includes('share') || msgLower.includes('update')) {
      return "Here is my updated address: 45 Orchard Avenue, Downtown Singapore 238879. Please confirm once the label is updated!";
    }
    if (msgLower.includes('updated') || msgLower.includes('modified') || msgLower.includes('done')) {
      return "Perfect, thank you so much for changing it before it left the warehouse! You saved my day!";
    }
    return "Thank you so much! Please let me know once the shipping address is confirmed.";
  }

  // 4. Ethan Ramirez (chair color / bed)
  if (customerName.toLowerCase().includes('ethan')) {
    if (msgLower.includes('color') || msgLower.includes('light') || msgLower.includes('return')) {
      return "Under daylight it looks much lighter than the photos online. Could I exchange it for the darker walnut finish?";
    }
    return "Thanks for looking into this. Let me know what exchange options are available.";
  }

  // 5. Liam Parker
  if (customerName.toLowerCase().includes('liam')) {
    return "Thank you so much for the assistance, the support team here has been fantastic!";
  }

  // Generic Customer Response
  if (msgLower.includes('thank') || msgLower.includes('terima kasih')) {
    return "You're very welcome! Have a great day!";
  }
  if (msgLower.includes('sorry') || msgLower.includes('maaf')) {
    return "No worries at all, thank you for handling it so professionally!";
  }
  return "Got it, thank you for the information! Let me know if there's anything else needed from my end.";
}
