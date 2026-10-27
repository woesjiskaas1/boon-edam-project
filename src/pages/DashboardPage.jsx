import Button from '../components/atoms/Button.jsx'
import Icon from '../components/atoms/Icon.jsx'
import PageHeading from '../components/molecules/PageHeading.jsx'
import ActivityList from '../components/organisms/ActivityList.jsx'
import EmployeeTable from '../components/organisms/EmployeeTable.jsx'
import StatGrid from '../components/organisms/StatGrid.jsx'

export default function DashboardPage({ user, employees, activities, statistics, onSelectStatistic, onAddEmployee, onViewEmployee, onViewEmployees, onViewActivities }) {
  return (
    <>
      <PageHeading title={`Goedemorgen, ${user.firstName}`} description="Hier is je organisatie in één overzicht." />
      <StatGrid statistics={statistics} onSelect={onSelectStatistic} />
      <div className="dashboard-panels">
        <section className="panel employees-panel" aria-labelledby="recent-employees-title">
          <div className="panel-header">
            <h2 id="recent-employees-title">Meest recente medewerkers</h2>
            <Button onClick={onAddEmployee}><Icon name="plus" size={21} />Medewerker toevoegen</Button>
          </div>
          <EmployeeTable employees={employees.slice(0, 3)} onView={onViewEmployee} compact />
          <div className="panel-footer"><Button variant="text" onClick={onViewEmployees}>Alle medewerkers bekijken<Icon name="arrow-right" size={18} /></Button></div>
        </section>
        <section className="panel activity-panel" aria-labelledby="activity-title">
          <div className="panel-header">
            <h2 id="activity-title">Recente activiteit</h2>
            <Button variant="text" onClick={onViewActivities}>Alles bekijken<Icon name="arrow-right" size={16} /></Button>
          </div>
          <ActivityList activities={activities.slice(0, 5)} />
        </section>
      </div>
    </>
  )
}
