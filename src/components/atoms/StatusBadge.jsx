export default function StatusBadge({ tone = 'active', children }) {
  return <span className={`status status-${tone}`}><span />{children}</span>
}
