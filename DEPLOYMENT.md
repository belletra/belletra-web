# Deployment

## Environments

| Environment | Branch    | URL                        | Stripe      |
|-------------|-----------|----------------------------|-------------|
| Staging     | `staging` | staging.belletra.app       | Test keys   |
| Production  | `main`    | belletra.app               | Live keys   |

## Workflow

1. Develop on `staging` branch
2. Deploy: `npm run deploy:staging`
3. Test at https://staging.belletra.app
4. Merge `staging` → `main`
5. Deploy: `npm run deploy:production`

## Commands

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Env files (gitignored — keep locally)

- `.env.staging`    — staging config (Stripe test keys, staging.belletra.app)
- `.env.production` — production config (Stripe live keys, belletra.app)

## Supabase Edge Functions

Both envs share the same Supabase project (lnxwunwkuikqwpqvwckf).
Stripe secrets currently set to TEST mode.
Before production launch: re-run `supabase secrets set` with live Stripe keys.
