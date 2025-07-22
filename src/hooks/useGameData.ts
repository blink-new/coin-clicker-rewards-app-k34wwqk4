import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { UserStats, Redemption, Upgrade } from '../types/game'

export function useGameData() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [upgrades, setUpgrades] = useState<Upgrade | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const loadGameData = async (userId: string) => {
    try {
      setLoading(true)
      console.log('🎮 Loading game data for user:', userId)
      
      // Load user stats
      console.log('📊 Loading user stats...')
      let stats = await blink.db.user_stats.list<UserStats>({
        where: { user_id: userId },
        limit: 1
      })
      console.log('📊 User stats loaded:', stats)
      
      if (stats.length === 0) {
        console.log('📊 Creating initial stats...')
        // Create initial stats
        const newStats = await blink.db.user_stats.create<UserStats>({
          user_id: userId,
          coins: 0,
          coins_per_click: 100,
          total_clicks: 0
        })
        console.log('📊 Initial stats created:', newStats)
        stats = [newStats]
      }
      
      setUserStats(stats[0])
      
      // Load redemptions
      console.log('💰 Loading redemptions...')
      const userRedemptions = await blink.db.redemptions.list<Redemption>({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' }
      })
      console.log('💰 Redemptions loaded:', userRedemptions)
      setRedemptions(userRedemptions)
      
      // Load upgrades
      console.log('⬆️ Loading upgrades...')
      let userUpgrades = await blink.db.upgrades.list<Upgrade>({
        where: { user_id: userId },
        limit: 1
      })
      console.log('⬆️ Upgrades loaded:', userUpgrades)
      
      if (userUpgrades.length === 0) {
        console.log('⬆️ Creating initial upgrades...')
        const newUpgrade = await blink.db.upgrades.create<Upgrade>({
          user_id: userId,
          upgrade_level: 0,
          total_spent: 0
        })
        console.log('⬆️ Initial upgrades created:', newUpgrade)
        userUpgrades = [newUpgrade]
      }
      
      setUpgrades(userUpgrades[0])
      console.log('✅ Game data loaded successfully')
      
    } catch (error) {
      console.error('❌ Error loading game data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user && !state.isLoading) {
        loadGameData(state.user.id)
      } else if (!state.isLoading) {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const updateCoins = async (newCoins: number, clicksToAdd: number = 0) => {
    if (!userStats || !user) return
    
    try {
      const updatedStats = await blink.db.user_stats.update<UserStats>(userStats.id, {
        coins: newCoins,
        total_clicks: userStats.total_clicks + clicksToAdd
      })
      setUserStats({ ...userStats, coins: newCoins, total_clicks: userStats.total_clicks + clicksToAdd })
    } catch (error) {
      console.error('Error updating coins:', error)
    }
  }

  const purchaseUpgrade = async () => {
    if (!userStats || !upgrades || !user) return false
    
    const upgradeCost = (upgrades.upgrade_level + 1) * 1000
    const upgradeBonus = (upgrades.upgrade_level + 1) * 50
    
    if (userStats.coins < upgradeCost) return false
    
    try {
      // Update coins and coins per click
      const newCoins = userStats.coins - upgradeCost
      const newCoinsPerClick = userStats.coins_per_click + upgradeBonus
      
      await blink.db.user_stats.update<UserStats>(userStats.id, {
        coins: newCoins,
        coins_per_click: newCoinsPerClick
      })
      
      // Update upgrade level
      await blink.db.upgrades.update<Upgrade>(upgrades.id, {
        upgrade_level: upgrades.upgrade_level + 1,
        total_spent: upgrades.total_spent + upgradeCost
      })
      
      setUserStats({
        ...userStats,
        coins: newCoins,
        coins_per_click: newCoinsPerClick
      })
      
      setUpgrades({
        ...upgrades,
        upgrade_level: upgrades.upgrade_level + 1,
        total_spent: upgrades.total_spent + upgradeCost
      })
      
      return true
    } catch (error) {
      console.error('Error purchasing upgrade:', error)
      return false
    }
  }

  const redeemCoins = async (coinsToSpend: number, cashAmount: number, paypalEmail: string) => {
    if (!userStats || !user) return false
    
    if (userStats.coins < coinsToSpend) return false
    
    try {
      // Create redemption record
      await blink.db.redemptions.create<Redemption>({
        user_id: user.id,
        coins_spent: coinsToSpend,
        cash_amount: cashAmount,
        paypal_email: paypalEmail,
        status: 'pending'
      })
      
      // Update user coins
      const newCoins = userStats.coins - coinsToSpend
      await blink.db.user_stats.update<UserStats>(userStats.id, {
        coins: newCoins
      })
      
      setUserStats({ ...userStats, coins: newCoins })
      
      // Reload redemptions
      const updatedRedemptions = await blink.db.redemptions.list<Redemption>({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      setRedemptions(updatedRedemptions)
      
      return true
    } catch (error) {
      console.error('Error redeeming coins:', error)
      return false
    }
  }

  return {
    userStats,
    redemptions,
    upgrades,
    loading,
    user,
    updateCoins,
    purchaseUpgrade,
    redeemCoins
  }
}