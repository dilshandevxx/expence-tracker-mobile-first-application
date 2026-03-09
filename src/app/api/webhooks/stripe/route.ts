import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// IMPORTANT: We must use the Service Role Key to bypass RLS when updating the `profiles` table from a webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret or signature missing' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;

        if (userId) {
          // Update the user's profile to active and save the Stripe customer ID
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'active',
              stripe_customer_id: customerId,
            })
            .eq('id', userId);

          if (error) {
            console.error('Error updating Supabase profile:', error);
            throw error;
          }
          console.log(`✅ Successfully activated subscription for user ${userId}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // If the subscription is no longer active (e.g., canceled, unpaid, past_due)
        const isSubActive = subscription.status === 'active' || subscription.status === 'trialing';

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
             subscription_status: isSubActive ? 'active' : 'inactive'
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
           console.error('Error updating Supabase profile on sub change:', error);
           throw error;
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
