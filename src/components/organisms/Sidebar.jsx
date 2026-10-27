import Brand from '../atoms/Brand.jsx'
import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'
import NavItem from '../molecules/NavItem.jsx'

export default function Sidebar({ sidebarRef, page, navigation, onNavigate, onClose, onLogout }) {
  return (
    <aside ref={sidebarRef} className="sidebar" id="main-navigation" aria-label="Hoofdnavigatie">
      <Button variant="plain" className="brand-button" onClick={() => onNavigate('Dashboard')} aria-label="Boon Edam dashboard"><Brand /></Button>
      <Button variant="icon" className="mobile-sidebar-close" onClick={onClose} aria-label="Navigatie sluiten"><Icon name="close" /></Button>
      <nav className="navigation">
        {navigation.map((item) => <NavItem key={item.name} icon={item.icon} active={page === item.name} onClick={() => onNavigate(item.name)}>{item.name}</NavItem>)}
      </nav>
      <div className="sidebar-bottom">
        <NavItem icon="logout" className="logout-button" onClick={onLogout}>Uitloggen</NavItem>
        <span className="sidebar-footnote">Boon Edam · Beheeromgeving</span>
      </div>
    </aside>
  )
}
