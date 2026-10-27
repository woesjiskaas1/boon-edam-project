import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'
import SearchField from '../molecules/SearchField.jsx'
import UserMenu from '../molecules/UserMenu.jsx'

export default function TopBar({ page, user, search, onSearchChange, onSearchSubmit, menuButtonRef, menuOpen, onToggleMenu, onLogout }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <Button ref={menuButtonRef} variant="icon" className="mobile-menu-button" onClick={onToggleMenu} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label="Navigatie openen"><Icon name="menu" /></Button>
        <Icon name="home" size={18} /><span>{page}</span>
      </div>
      <div className="topbar-actions">
        <SearchField value={search} onChange={onSearchChange} onSubmit={onSearchSubmit} />
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  )
}
