import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Coins, DollarSign, Mail, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useGameData } from '../hooks/useGameData'

export function HistoryPage() {
  const { redemptions, loading } = useGameData()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your history...</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-400" size={16} />
      case 'failed':
        return <XCircle className="text-red-400" size={16} />
      default:
        return <Clock className="text-yellow-400" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600'
      case 'failed':
        return 'bg-red-600'
      default:
        return 'bg-yellow-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalRedeemed = redemptions.reduce((sum, redemption) => 
    redemption.status === 'completed' ? sum + redemption.cash_amount : sum, 0
  )

  const totalCoinsSpent = redemptions.reduce((sum, redemption) => 
    redemption.status === 'completed' ? sum + redemption.coins_spent : sum, 0
  )

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Redemption History
          </h1>
          <p className="text-slate-300">
            Track all your PayPal cash redemptions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="text-green-400" size={24} />
                <span className="text-slate-300 font-medium">Total Earned</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                ${totalRedeemed.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="text-yellow-400" size={24} />
                <span className="text-slate-300 font-medium">Coins Spent</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {totalCoinsSpent.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-blue-400 text-xl">📊</span>
                <span className="text-slate-300 font-medium">Total Redemptions</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {redemptions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Redemption List */}
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="text-slate-400 mb-4">
                  <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Redemptions Yet</h3>
                  <p>Start clicking coins and redeem them for PayPal cash!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            redemptions.map((redemption) => (
              <Card key={redemption.id} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="text-green-400" size={20} />
                      ${redemption.cash_amount.toFixed(2)} PayPal Cash
                    </CardTitle>
                    <Badge className={`${getStatusColor(redemption.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(redemption.status)}
                        {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Coins className="text-yellow-400" size={16} />
                      <span className="text-slate-300">Coins Spent:</span>
                      <span className="font-semibold text-yellow-400">
                        {redemption.coins_spent.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="text-blue-400" size={16} />
                      <span className="text-slate-300">PayPal Email:</span>
                      <span className="font-semibold text-blue-400">
                        {redemption.paypal_email}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock size={14} />
                    <span>Redeemed on {formatDate(redemption.created_at)}</span>
                  </div>
                  
                  {redemption.status === 'pending' && (
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                      <p className="text-yellow-400 text-sm">
                        ⏳ Your payment is being processed and will be sent within 24-48 hours
                      </p>
                    </div>
                  )}
                  
                  {redemption.status === 'completed' && (
                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm">
                        ✅ Payment has been sent to your PayPal account
                      </p>
                    </div>
                  )}
                  
                  {redemption.status === 'failed' && (
                    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">
                        ❌ Payment failed. Please contact support for assistance.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}