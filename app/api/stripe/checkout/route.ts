import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { plan, workspaceId } = await req.json();

    const priceMap: Record<string, string> = {
      PRO: process.env.STRIPE_PRICE_PRO || 'price_test_pro_19',
      BUSINESS: process.env.STRIPE_PRICE_BUSINESS || 'price_test_biz_49',
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If Stripe keys are placeholder, return sandbox simulation URL
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return NextResponse.json({
        url: `${appUrl}/dashboard?session_id=cs_test_mock_${Date.now()}&status=success`,
        isSandboxSimulation: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        workspace_id: workspaceId || 'ws-nordic-01',
        plan,
      },
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${appUrl}/dashboard/settings?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
