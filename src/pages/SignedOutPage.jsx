import Brand from '../components/atoms/Brand.jsx'
import Button from '../components/atoms/Button.jsx'
import Icon from '../components/atoms/Icon.jsx'

export default function SignedOutPage({ onOpenDashboard }) {
  return (
    <main className="signed-out">
      <Brand /><div className="signed-out-icon"><Icon name="logout" size={28} /></div>
      <h1>Je bent uitgelogd</h1><p>Je kunt het voorbeelddashboard opnieuw openen.</p>
      <Button onClick={onOpenDashboard}>Dashboard openen<Icon name="arrow-right" size={18} /></Button>
      <span className="demo-note">Voorbeeldomgeving · geen echte inlogsessie</span>
    </main>
  )
}
