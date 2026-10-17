import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json().catch(() => ({ customerId: 'cus_test_mock' }));
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://merchlysaas.vercel.app';
    const appUrl = origin;

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return NextResponse.json({
        url: `${appUrl}/dashboard/settings?portal_simulated=true`,
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId || 'cus_test_mock',
      return_url: `${appUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Stripe Portal Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
