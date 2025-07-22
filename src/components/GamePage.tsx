import { CoinButton } from './CoinButton'
import { UpgradePanel } from './UpgradePanel'
import { Card, CardContent } from './ui/card'
import { Coins, MousePointer } from 'lucide-react'
import { useGameData } from '../hooks/useGameData'

export function GamePage() {
  const { userStats, upgrades, loading, updateCoins, purchaseUpgrade } = useGameData()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your game...</p>
        </div>
      </div>
    )
  }

  if (!userStats || !upgrades) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">Unable to load game data</p>
        </div>
      </div>
    )
  }

  const handleCoinClick = () => {
    const newCoins = userStats.coins + userStats.coins_per_click
    updateCoins(newCoins, 1)
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="text-yellow-400" size={24} />
                <span className="text-slate-300 font-medium">Total Coins</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {userStats.coins.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MousePointer className="text-green-400" size={24} />
                <span className="text-slate-300 font-medium">Per Click</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {userStats.coins_per_click}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-blue-400 text-xl">🎯</span>
                <span className="text-slate-300 font-medium">Total Clicks</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {userStats.total_clicks.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Coin Button */}
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">
                Coin Clicker
              </h1>
              <p className="text-slate-300 text-center">
                Click the button to earn coins!
              </p>
            </div>
            
            <CoinButton
              coinsPerClick={userStats.coins_per_click}
              onCoinClick={handleCoinClick}
            />
            
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                Click to earn {userStats.coins_per_click} coins
              </p>
            </div>
          </div>

          {/* Upgrade Panel */}
          <div className="flex-shrink-0">
            <UpgradePanel
              userStats={userStats}
              upgrades={upgrades}
              onUpgrade={purchaseUpgrade}
            />
          </div>
        </div>
      </div>
    </div>
  )
}