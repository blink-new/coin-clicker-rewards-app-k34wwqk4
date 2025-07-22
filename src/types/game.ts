export interface UserStats {
  id: string
  user_id: string
  coins: number
  coins_per_click: number
  total_clicks: number
  created_at: string
  updated_at: string
}

export interface Redemption {
  id: string
  user_id: string
  coins_spent: number
  cash_amount: number
  paypal_email: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface Upgrade {
  id: string
  user_id: string
  upgrade_level: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface RedemptionTier {
  coins: number
  cash: number
  label: string
}

export interface CoinAnimation {
  id: string
  x: number
  y: number
  amount: number
}