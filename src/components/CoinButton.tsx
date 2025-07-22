import { useState } from 'react'
import { Button } from './ui/button'
import { Coins } from 'lucide-react'
import { CoinAnimation } from '../types/game'

interface CoinButtonProps {
  coinsPerClick: number
  onCoinClick: () => void
  disabled?: boolean
}

export function CoinButton({ coinsPerClick, onCoinClick, disabled }: CoinButtonProps) {
  const [animations, setAnimations] = useState<CoinAnimation[]>([])
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    
    // Button press animation
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
    
    // Create coin animation
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Create multiple coin animations
    const newAnimations: CoinAnimation[] = []
    const numCoins = Math.min(5, Math.floor(coinsPerClick / 50) + 1)
    
    for (let i = 0; i < numCoins; i++) {
      const angle = (i / numCoins) * Math.PI * 2
      const radius = 30 + Math.random() * 20
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      newAnimations.push({
        id: `${Date.now()}-${i}`,
        x,
        y,
        amount: Math.floor(coinsPerClick / numCoins)
      })
    }
    
    setAnimations(prev => [...prev, ...newAnimations])
    
    // Remove animations after they complete
    setTimeout(() => {
      setAnimations(prev => prev.filter(anim => 
        !newAnimations.some(newAnim => newAnim.id === anim.id)
      ))
    }, 800)
    
    onCoinClick()
  }

  return (
    <div className="relative flex justify-center">
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={`
          w-48 h-48 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 
          hover:from-yellow-300 hover:to-yellow-500 
          active:from-yellow-500 active:to-yellow-700
          border-4 border-yellow-300 shadow-2xl
          text-slate-900 font-bold text-xl
          transition-all duration-200 transform
          ${isPressed ? 'scale-95' : 'hover:scale-105'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <Coins size={48} />
          <span>+{coinsPerClick}</span>
          <span className="text-sm">COINS</span>
        </div>
      </Button>
      
      {/* Floating coin animations */}
      {animations.map((anim) => (
        <div
          key={anim.id}
          className="coin-float coin-animation"
          style={{
            left: anim.x,
            top: anim.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          +{anim.amount}
        </div>
      ))}
    </div>
  )
}