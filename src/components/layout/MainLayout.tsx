import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Receipt, 
  Users, 
  Scale, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { GlassNavigation, GlassNavItem, GlassNavBrand, GlassNavSection } from '@/components/ui/glass-navigation'
import { GlassButton } from '@/components/ui/glass-button'

interface MainLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Balances', href: '/balances', icon: Scale },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar Navigation */}
      <GlassNavigation
        variant="elevated"
        position="sidebar"
        blur="xl"
        className={cn(
          "w-64 transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-white/10">
            <GlassNavBrand className="text-black font-geist">
              Splitwise
            </GlassNavBrand>
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden mr-4"
            >
              <X className="h-5 w-5" />
            </GlassButton>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 p-4">
            <GlassNavSection title="Main">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <GlassNavItem
                      active={isActive}
                      icon={<item.icon className="h-5 w-5" />}
                    >
                      {item.name}
                    </GlassNavItem>
                  </Link>
                )
              })}
            </GlassNavSection>
          </div>
        </div>
      </GlassNavigation>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <GlassNavigation
          variant="elevated"
          position="top"
          className="lg:hidden h-16"
        >
          <div className="flex items-center justify-between px-6 h-full">
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </GlassButton>
            <GlassNavBrand className="px-0 text-black font-geist">
              Splitwise
            </GlassNavBrand>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </GlassNavigation>
        
        <main className="p-6 lg:pt-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  )
}