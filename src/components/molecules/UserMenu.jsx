import { useEffect, useRef, useState } from 'react'
import Avatar from '../atoms/Avatar.jsx'
import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const menu = useRef(null)

  useEffect(() => {
    function closeOutside(event) {
      if (!menu.current?.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div className="user-menu" ref={menu}>
      <Button variant="plain" className="user-button" onClick={() => setOpen((previous) => !previous)} aria-expanded={open} aria-controls={open ? 'user-options' : undefined}>
        <Avatar initials={user.initials} />
        <span className="user-copy"><strong>{user.name}</strong><span>{user.role}</span></span>
        <Icon name="chevron-down" size={17} /><span className="sr-only">Accountmenu voor {user.name}</span>
      </Button>
      {open && <div className="user-dropdown" id="user-options">
        <span>Voorbeeldaccount</span><strong>{user.name}</strong>
        <Button variant="plain" onClick={() => { setOpen(false); onLogout() }}><Icon name="logout" size={17} />Uitloggen</Button>
      </div>}
    </div>
  )
}
