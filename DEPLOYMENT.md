# Deployment

## Environments

| Environment | Branch    | URL                              | Stripe      |
|-------------|-----------|----------------------------------|-------------|
| Staging     | `staging` | belletra-web-staging.pages.dev   | Test keys   |
| Production  | `main`    | belletra.app                     | Live keys   |

## Workflow

1. Develop on `staging` branch
2. Test at belletra-web-staging.pages.dev
3. Merge `staging` → `main` when ready
4. Deploy to production

## Commands

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Env files (gitignored — keep locally)

- `.env.staging`  — staging config (Stripe test keys)
- `.env.production` — production config (Stripe live keys)

## Supabase Edge Function secrets

Staging and production share the same Supabase project.
Stripe keys are injected via `supabase secrets set --project-ref lnxwunwkuikqwpqvwckf`.
Currently set to TEST mode. Switch to LIVE keys before production launch.
