import { useState } from 'react'
import { Button } from './ui/button'
import { Coins } from 'lucide-react'

interface CoinButtonProps {
  coinsPerClick: number
  onCoinClick: () => void
  disabled?: boolean
}

export function CoinButton({ coinsPerClick, onCoinClick, disabled }: CoinButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (disabled) return
    
    // Button press animation
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
    
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
    </div>
  )
}