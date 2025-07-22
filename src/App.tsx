import { useState } from 'react'
import { GamePage } from './components/GamePage'
import { RedeemPage } from './components/RedeemPage'
import { HistoryPage } from './components/HistoryPage'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/toaster'
import { Coins, DollarSign, History, Menu, X } from 'lucide-react'

type Page = 'game' | 'redeem' | 'history'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('game')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { id: 'game' as Page, label: 'Play Game', icon: Coins },
    { id: 'redeem' as Page, label: 'Redeem', icon: DollarSign },
    { id: 'history' as Page, label: 'History', icon: History }
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'game':
        return <GamePage />
      case 'redeem':
        return <RedeemPage />
      case 'history':
        return <HistoryPage />
      default:
        return <GamePage />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Coins className="text-yellow-400" size={28} />
              <span className="text-xl font-bold text-yellow-400">
                Coin Clicker
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 ${
                      currentPage === item.id
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-slate-900'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Button>
                )
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      onClick={() => {
                        setCurrentPage(item.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`flex items-center gap-2 justify-start ${
                        currentPage === item.id
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-slate-900'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {renderPage()}
      </main>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}

export default App