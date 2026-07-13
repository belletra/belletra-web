const PAYMENT_LINKS: Record<string, string> = {
  month: Deno.env.get('STRIPE_LINK_MONTHLY') ?? 'https://buy.stripe.com/8x27sL85b2Nd02kftbf7i00',
  year: Deno.env.get('STRIPE_LINK_YEARLY') ?? 'https://buy.stripe.com/eVq5kD7175Zp8yQ94Nf7i01',
  lifetime: Deno.env.get('STRIPE_LINK_LIFETIME') ?? 'https://buy.stripe.com/6oU4gz4SZevV02k80Jf7i02',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    const { plan, userId, email } = await req.json() as {
      plan: 'year' | 'month' | 'lifetime'
      userId: string
      email: string
    }

    const baseUrl = PAYMENT_LINKS[plan]
    if (!baseUrl) {
      return json({ error: 'Invalid plan' }, 400)
    }

    const url = new URL(baseUrl)
    if (email) url.searchParams.set('prefilled_email', email)
    if (userId) url.searchParams.set('client_reference_id', userId)

    return json({ url: url.toString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return json({ error: message }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
