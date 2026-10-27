import { useEffect, useRef, useState } from 'react'
import Button from '../components/atoms/Button.jsx'
import Sidebar from '../components/organisms/Sidebar.jsx'
import TopBar from '../components/organisms/TopBar.jsx'

const currentYear = new Date().getFullYear()

export default function DashboardLayout({ page, user, navigation, search, onSearchChange, onSearchSubmit, onNavigate, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebar = useRef(null)
  const menuButton = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const sidebarElement = sidebar.current
    function focusMenu(event) {
      if (event && event.target !== sidebarElement) return
      if (!sidebarElement.contains(document.activeElement)) sidebarElement.querySelector('button')?.focus()
    }
    const focusFrame = requestAnimationFrame(() => focusMenu())
    sidebarElement.addEventListener('transitionend', focusMenu)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 761px)')

    function handleKeys(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        requestAnimationFrame(() => menuButton.current?.focus())
      }
      if (event.key === 'Tab') {
        const buttons = [...sidebar.current.querySelectorAll('button')]
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (!sidebar.current.contains(document.activeElement)) { event.preventDefault(); first.focus(); return }
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }

    function closeOnDesktop(event) {
      if (event.matches) setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeys)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      cancelAnimationFrame(focusFrame)
      sidebarElement.removeEventListener('transitionend', focusMenu)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeys)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
    requestAnimationFrame(() => menuButton.current?.focus())
  }

  function handleNavigate(destination) {
    setMenuOpen(false)
    onNavigate(destination)
  }

  function handleLogout() {
    setMenuOpen(false)
    onLogout()
  }

  return (
    <div className={`app-shell ${menuOpen ? 'navigation-open' : ''}`}>
      <a className="skip-link" href="#main-content">Ga naar de inhoud</a>
      {menuOpen && <Button variant="plain" className="sidebar-backdrop" aria-label="Navigatie sluiten" tabIndex={-1} onClick={closeMenu} />}
      <Sidebar sidebarRef={sidebar} page={page} navigation={navigation} onNavigate={handleNavigate} onClose={closeMenu} onLogout={handleLogout} />
      <div className="workspace" inert={menuOpen || undefined}>
        <TopBar page={page} user={user} search={search} onSearchChange={onSearchChange} onSearchSubmit={onSearchSubmit} menuButtonRef={menuButton} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onLogout={handleLogout} />
        <main className="main-content" id="main-content" tabIndex={-1}>
          {children}
          <footer className="workspace-footer"><span>© {currentYear} Boon Edam</span><span><span className="footer-dot" />Voorbeeldomgeving</span></footer>
        </main>
      </div>
    </div>
  )
}
