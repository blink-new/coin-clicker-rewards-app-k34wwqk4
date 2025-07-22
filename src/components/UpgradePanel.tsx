import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { TrendingUp, Coins } from 'lucide-react'
import { Upgrade, UserStats } from '../types/game'

interface UpgradePanelProps {
  userStats: UserStats
  upgrades: Upgrade
  onUpgrade: () => Promise<boolean>
}

export function UpgradePanel({ userStats, upgrades, onUpgrade }: UpgradePanelProps) {
  const nextUpgradeCost = (upgrades.upgrade_level + 1) * 1000
  const nextUpgradeBonus = (upgrades.upgrade_level + 1) * 50
  const canAfford = userStats.coins >= nextUpgradeCost

  const handleUpgrade = async () => {
    const success = await onUpgrade()
    if (success) {
      // Add some visual feedback here if needed
    }
  }

  return (
    <Card className="w-full max-w-md bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <TrendingUp size={20} />
          Upgrades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Current Level:</span>
          <span className="font-bold text-yellow-400">{upgrades.upgrade_level}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Coins per Click:</span>
          <span className="font-bold text-green-400">{userStats.coins_per_click}</span>
        </div>
        
        <div className="border-t border-slate-700 pt-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Next Upgrade:</span>
              <span className="font-bold text-green-400">+{nextUpgradeBonus} per click</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Cost:</span>
              <span className={`font-bold flex items-center gap-1 ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                <Coins size={14} />
                {nextUpgradeCost.toLocaleString()}
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleUpgrade}
            disabled={!canAfford}
            className={`w-full ${
              canAfford 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Upgrade Now!' : 'Not Enough Coins'}
          </Button>
        </div>
        
        {upgrades.total_spent > 0 && (
          <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-700">
            Total Spent: {upgrades.total_spent.toLocaleString()} coins
          </div>
        )}
      </CardContent>
    </Card>
  )
}