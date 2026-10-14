import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia' as any,
});

// Idempotency cache (event.id)
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development or sandbox simulation
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // Idempotency check
  if (event.id && processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, message: 'Already processed' });
  }
  if (event.id) {
    processedEvents.add(event.id);
  }

  // Handle Event Types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const workspaceId = session.metadata?.workspace_id;
      const plan = session.metadata?.plan || 'PRO';
      console.log(`[Webhook] Activated ${plan} plan for workspace ${workspaceId}`);
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Webhook] Invoice paid: ${invoice.id}`);
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[Webhook] Subscription updated: ${sub.id}`);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[Webhook] Subscription deleted / downgraded: ${sub.id}`);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn(`[Webhook] Payment failed for invoice ${invoice.id}`);
      break;
    }
    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true, eventId: event.id });
}
