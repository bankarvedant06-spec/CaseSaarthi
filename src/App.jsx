import { AppProvider, useApp } from './AppContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Complaints from './pages/Complaints'
import CoordinationRadar from './pages/CoordinationRadar'
import Dashboard from './pages/Dashboard'
import Institutions from './pages/Institutions'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Trends from './pages/Trends'
import './App.css'

const pages = {
  dashboard: Dashboard,
  complaints: Complaints,
  institutions: Institutions,
  radar: CoordinationRadar,
  reports: Reports,
  trends: Trends,
  settings: Settings,
}

function Screen() {
  const { isAuthenticated, page } = useApp()
  if (window.location.pathname === '/reset-password') return <ResetPassword />
  if (!isAuthenticated) return <Login />

  const Page = pages[page] || Dashboard
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Screen />
    </AppProvider>
  )
}
