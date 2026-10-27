import Icon from '../atoms/Icon.jsx'

export default function ActivityList({ activities }) {
  return (
    <ul className="activity-list">
      {activities.map((activity) => (
        <li key={activity.id}>
          <span className="activity-icon"><Icon name={activity.icon} size={21} /></span>
          <div><p>{activity.text}</p><span className="activity-time">{activity.time}</span></div>
          <span className={`activity-dot ${activity.invited ? 'is-yellow' : ''}`} aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}
