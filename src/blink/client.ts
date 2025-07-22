import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'coin-clicker-rewards-app-k34wwqk4',
  authRequired: false // Let's handle auth manually for better control
})