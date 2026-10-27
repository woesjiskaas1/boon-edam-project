import { useRef } from 'react'
import Icon from '../atoms/Icon.jsx'

export default function SearchField({ value, onChange, onSubmit }) {
  const input = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
    input.current?.focus()
  }

  return (
    <form className="search-box" role="search" onSubmit={handleSubmit}>
      <Icon name="search" size={20} />
      <input ref={input} type="search" aria-label="Zoeken op naam, e-mailadres of rol" placeholder="Zoeken..." value={value} onChange={(event) => onChange(event.target.value)} />
      <span className="search-hint" aria-hidden="true">⌕</span>
    </form>
  )
}
