import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Coins, DollarSign, Mail } from 'lucide-react'
import { useGameData } from '../hooks/useGameData'
import { RedemptionTier } from '../types/game'
import { useToast } from '../hooks/use-toast'

const REDEMPTION_TIERS: RedemptionTier[] = [
  { coins: 5000, cash: 1, label: '$1' },
  { coins: 10000, cash: 5, label: '$5' },
  { coins: 20000, cash: 10, label: '$10' },
  { coins: 50000, cash: 20, label: '$20' },
  { coins: 100000, cash: 50, label: '$50' },
  { coins: 250000, cash: 100, label: '$100' }
]

export function RedeemPage() {
  const { userStats, loading, redeemCoins } = useGameData()
  const { toast } = useToast()
  const [paypalEmail, setPaypalEmail] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">Unable to load your data</p>
        </div>
      </div>
    )
  }

  const handleRedeem = async (tier: RedemptionTier) => {
    if (!paypalEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your PayPal email address",
        variant: "destructive"
      })
      return
    }

    if (!paypalEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    setIsRedeeming(true)
    
    try {
      const success = await redeemCoins(tier.coins, tier.cash, paypalEmail)
      
      if (success) {
        toast({
          title: "Redemption Successful!",
          description: `Your ${tier.label} PayPal payment is being processed`,
          variant: "default"
        })
        setPaypalEmail('')
      } else {
        toast({
          title: "Redemption Failed",
          description: "You don't have enough coins for this redemption",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Redeem Coins
          </h1>
          <p className="text-slate-300">
            Exchange your coins for PayPal cash
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Coins className="text-yellow-400" size={24} />
            <span className="text-2xl font-bold text-yellow-400">
              {userStats.coins.toLocaleString()} coins available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REDEMPTION_TIERS.map((tier) => {
            const canAfford = userStats.coins >= tier.coins
            
            return (
              <Card 
                key={tier.coins} 
                className={`bg-slate-800 border-2 transition-all duration-200 ${
                  canAfford 
                    ? 'border-green-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20' 
                    : 'border-slate-600 opacity-60'
                }`}
              >
                <CardHeader className="text-center pb-3">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <DollarSign className="text-green-400" size={24} />
                    <span className="text-2xl font-bold text-green-400">
                      {tier.label}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="text-yellow-400" size={20} />
                      <span className="text-lg font-semibold text-yellow-400">
                        {tier.coins.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      coins required
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={!canAfford || isRedeeming}
                        className={`w-full ${
                          canAfford
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? `Redeem ${tier.label}` : 'Not Enough Coins'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-yellow-400">
                          Redeem {tier.label} PayPal Cash
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-slate-700 rounded-lg">
                          <p className="text-slate-300">
                            You're about to redeem <span className="font-bold text-yellow-400">{tier.coins.toLocaleString()} coins</span> for <span className="font-bold text-green-400">{tier.label}</span> PayPal cash
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="paypal-email" className="text-slate-300">
                            PayPal Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="paypal-email"
                              type="email"
                              placeholder="your-email@example.com"
                              value={paypalEmail}
                              onChange={(e) => setPaypalEmail(e.target.value)}
                              className="pl-10 bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleRedeem(tier)}
                          disabled={isRedeeming || !paypalEmail.trim()}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {isRedeeming ? 'Processing...' : `Confirm Redemption`}
                        </Button>
                        
                        <p className="text-xs text-slate-400 text-center">
                          PayPal payments are processed within 24-48 hours
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-slate-800 border-slate-700 max-w-md mx-auto">
            <CardContent className="p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">How it works</h3>
              <ul className="text-sm text-slate-300 space-y-1 text-left">
                <li>• Choose your redemption amount</li>
                <li>• Enter your PayPal email address</li>
                <li>• Confirm your redemption</li>
                <li>• Receive payment within 24-48 hours</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}