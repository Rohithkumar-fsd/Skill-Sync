import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Layers3, ListTodo, Lightbulb,
  BarChart3, Settings, Zap, LogOut, Moon, Sun,
  ChevronLeft, Menu, X, User, Bell,
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useTheme } from '../../contexts/ThemeContext'
import { getAuth } from 'firebase/auth'

// ─── Navigation config ──────────────────────────────────────────────────────
const NAV_MAIN = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/skills',    label: 'Skills',    icon: Layers3 },
  { to: '/tasks',     label: 'Tasks',     icon: ListTodo },
  { to: '/goals',     label: 'Goals',     icon: Lightbulb },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const NAV_BOTTOM = [
  { to: '/profile',  label: 'Profile',  icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

// ─── Mobile Bottom Bar (shown on <768px) ────────────────────────────────────
const MOBILE_TABS = [
  { to: '/dashboard', label: 'Home',      icon: LayoutDashboard },
  { to: '/skills',    label: 'Skills',    icon: Layers3 },
  { to: '/tasks',     label: 'Tasks',     icon: ListTodo },
  { to: '/goals',     label: 'Goals',     icon: Lightbulb },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

// ─── Sidebar NavItem ─────────────────────────────────────────────────────────
const SideNavItem = ({ item, collapsed }) => {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
      }
    >
      <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

// ─── AppShell ────────────────────────────────────────────────────────────────
export const AppShell = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const firebaseAuth = getAuth()

  const [collapsed, setCollapsed]       = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [scrolled, setScrolled]         = useState(false)

  const userEmail = firebaseAuth.currentUser?.email || ''
  const userName  = firebaseAuth.currentUser?.displayName || userEmail.split('@')[0] || 'User'
  const userInit  = userName.charAt(0).toUpperCase()

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const pageTitle = (() => {
    const map = {
      '/dashboard': 'Dashboard',
      '/skills':    'Skills',
      '/tasks':     'Tasks',
      '/goals':     'Goals',
      '/analytics': 'Analytics',
      '/settings':  'Settings',
      '/profile':   'Profile',
      '/skill-gap': 'Skill Gap Analyzer',
    }
    return map[location.pathname] || 'LevelUP'
  })()

  return (
    <div className="app-shell bg-gray-50 dark:bg-zinc-950">

      {/* ── Mobile Overlay ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`app-sidebar
          ${collapsed ? 'collapsed' : ''}
          ${mobileOpen ? '' : 'mobile-hidden md:translate-x-0'}
          transition-all duration-300 ease-in-out
        `}
        style={{ transform: undefined }}
      >
        {/* Sidebar header */}
        <div className={`flex items-center gap-3 px-4 border-b border-gray-200 dark:border-zinc-800 shrink-0
          ${collapsed ? 'justify-center py-4' : 'justify-between py-4'}`}
          style={{ height: 'var(--topbar-h)' }}
        >
          {!collapsed && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">LevelUP</span>
            </button>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/dashboard')}>
              <Zap className="w-4 h-4 text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="btn-icon hidden lg:flex"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* Skill Gap shortcut */}
          <NavLink
            to="/skill-gap"
            title={collapsed ? 'Skill Gap Analyzer' : undefined}
            className={({ isActive }) =>
              `nav-item mb-3 ${isActive ? 'active' : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400'}
               ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            <Zap className="shrink-0" style={{ width: 16, height: 16 }} />
            {!collapsed && <span className="font-semibold text-xs">AI Skill Gap</span>}
          </NavLink>

          <div className="h-px bg-gray-200 dark:bg-zinc-800 mb-3" />

          {NAV_MAIN.map((item) => (
            <SideNavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 pb-4 pt-2 border-t border-gray-200 dark:border-zinc-800 space-y-1">
          {NAV_BOTTOM.map((item) => (
            <SideNavItem key={item.to} item={item} collapsed={collapsed} />
          ))}

          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign out' : undefined}
            className={`nav-item w-full text-left text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300
              ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <LogOut style={{ width: 18, height: 18 }} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300
        ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}
      >
        {/* Top bar */}
        <header className={`app-topbar ${scrolled ? 'shadow-sm' : ''}`}>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="btn-icon md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Expand sidebar (desktop, when collapsed) */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="btn-icon hidden md:flex"
              title="Expand sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Page title breadcrumb */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Skill Gap quick button */}
            <button
              onClick={() => navigate('/skill-gap')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50
                text-indigo-700 dark:text-indigo-400
                hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Skill Gap
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            {/* Avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                flex items-center justify-center text-white font-bold text-xs
                hover:opacity-90 transition-opacity shrink-0"
              title={userName}
            >
              {userInit}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Bar ────────────────────────────────────────────── */}
      <nav className="mobile-bottom-bar md:hidden">
        {MOBILE_TABS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: '10px' }}>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default AppShell
