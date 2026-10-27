import { useEffect, useRef } from 'react'
import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function Dialog({ title, children, onClose, className = '' }) {
  const dialog = useRef(null)

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  return (
    <dialog ref={dialog} className={`dialog ${className}`} onClose={onClose} aria-labelledby="dialog-title">
      <div className="dialog-heading">
        <h2 id="dialog-title">{title}</h2>
        <Button variant="icon" onClick={onClose} aria-label="Venster sluiten"><Icon name="close" /></Button>
      </div>
      {children}
    </dialog>
  )
}
