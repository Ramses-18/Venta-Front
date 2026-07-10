import { NavLink, useLocation } from 'react-router-dom'
import './BottomNav.css'

const links = [
  { to: '/', label: 'Inicio', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { to: '/clientes', label: 'Clientes', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { to: '/ventas', label: 'Ventas', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  )},
]

function BottomNav() {
  const location = useLocation()

  // Ocultar bottom nav en historial
  if (location.pathname.startsWith('/historial/')) return null

  return (
    <nav className="bottom-nav">
      {links.map((link) => {
        const isActive = link.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(link.to)
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span className="bottom-nav-label">{link.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default BottomNav