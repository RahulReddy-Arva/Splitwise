import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardView } from './views/DashboardView'
import { ExpensesView } from './views/ExpensesView'
import { GroupsView } from './views/GroupsView'
import { BalancesView } from './views/BalancesView'
import { SettingsView } from './views/SettingsView'
import { LoginView } from './views/LoginView'
import { MainLayout } from './components/layout/MainLayout'
import { useAuthStore } from './stores/authStore'

function App() {
  const { isAuthenticated, initialize } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from stored data on app start
    initialize()
  }, [initialize])

  if (!isAuthenticated) {
    return <LoginView />
  }

  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/expenses" element={<ExpensesView />} />
            <Route path="/groups" element={<GroupsView />} />
            <Route path="/balances" element={<BalancesView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App