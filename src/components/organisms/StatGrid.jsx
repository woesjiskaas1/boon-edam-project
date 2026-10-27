import StatCard from '../molecules/StatCard.jsx'

export default function StatGrid({ statistics, onSelect }) {
  return (
    <section className="stat-grid" aria-label="Organisatie in cijfers">
      {statistics.map((statistic) => <StatCard key={statistic.label} {...statistic} onClick={() => onSelect(statistic)} />)}
    </section>
  )
}
