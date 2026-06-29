// Edge function names — resolved at build time per environment
export const CHECKOUT_FUNCTION = (import.meta.env.VITE_CHECKOUT_FUNCTION as string) || 'create-checkout'
