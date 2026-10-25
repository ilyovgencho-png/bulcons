// Минимално описание на променливите, които Worker-ът чете от wrangler.jsonc / secrets.
declare module 'cloudflare:workers' {
  export const env: {
    RESEND_API_KEY?: string
    INQUIRY_TO?: string
    INQUIRY_FROM?: string
  }
}
