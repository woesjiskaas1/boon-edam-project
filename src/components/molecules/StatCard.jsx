import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function StatCard({ label, value, icon, tone, onClick }) {
  return (
    <Button variant="plain" className="stat-card" onClick={onClick}>
      <span className={`stat-icon tone-${tone}`}><Icon name={icon} size={27} /></span>
      <span className="stat-copy"><strong>{value}</strong><span>{label}</span></span>
      <Icon name="chevron-right" size={20} className="stat-chevron" />
    </Button>
  )
}
