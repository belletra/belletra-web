import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY_STAGING')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req) => {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) return new Response('No signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET_STAGING')!,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return new Response(message, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId ?? session.client_reference_id
    const plan = session.metadata?.plan as 'year' | 'month' | 'lifetime' | undefined

    if (!userId || !plan) {
      return new Response('Missing metadata', { status: 400 })
    }

    if (plan === 'lifetime') {
      // Cancel any existing subscription before granting lifetime
      const { data: existing } = await supabase
        .from('user_subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', userId)
        .maybeSingle()
      if (existing?.stripe_subscription_id) {
        await stripe.subscriptions.cancel(existing.stripe_subscription_id)
      }

      await supabase.from('user_subscriptions').upsert(
        {
          user_id: userId,
          plan: 'lifetime',
          status: 'active',
          stripe_customer_id: session.customer as string | null,
          stripe_subscription_id: null,
          current_period_end: null,
        },
        { onConflict: 'user_id' },
      )
    } else {
      let currentPeriodEnd: string | null = null
      let stripeSubscriptionId: string | null = null

      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        stripeSubscriptionId = sub.id
        currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString()
      }

      await supabase.from('user_subscriptions').upsert(
        {
          user_id: userId,
          plan,
          status: 'active',
          stripe_customer_id: session.customer as string | null,
          stripe_subscription_id: stripeSubscriptionId,
          current_period_end: currentPeriodEnd,
        },
        { onConflict: 'user_id' },
      )
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled', plan: 'free' })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString()
    const status = sub.status === 'active' || sub.status === 'trialing' ? 'active' : 'cancelled'
    await supabase
      .from('user_subscriptions')
      .update({ status, current_period_end: currentPeriodEnd })
      .eq('stripe_subscription_id', sub.id)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
