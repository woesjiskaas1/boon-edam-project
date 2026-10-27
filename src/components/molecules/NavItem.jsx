import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function NavItem({ icon, children, active = false, className = '', onClick }) {
  return (
    <Button variant="plain" className={`nav-item${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`} aria-current={active ? 'page' : undefined} onClick={onClick}>
      <Icon name={icon} size={22} /><span>{children}</span>
    </Button>
  )
}
