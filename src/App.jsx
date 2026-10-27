import AppDialogs from './components/organisms/AppDialogs.jsx'
import Toast from './components/molecules/Toast.jsx'
import DashboardLayout from './templates/DashboardLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EmployeesPage from './pages/EmployeesPage.jsx'
import RolesPage from './pages/RolesPage.jsx'
import SignedOutPage from './pages/SignedOutPage.jsx'
import useDashboard from './hooks/useDashboard.js'
import { currentUser, navigation } from './data/dashboard.js'

function App() {
  const dashboard = useDashboard()

  if (!dashboard.signedIn) {
    return <SignedOutPage onOpenDashboard={dashboard.openDashboard} />
  }

  return (
    <>
      <DashboardLayout
        page={dashboard.page}
        user={currentUser}
        navigation={navigation}
        search={dashboard.search}
        onSearchChange={dashboard.updateSearch}
        onSearchSubmit={dashboard.submitSearch}
        onNavigate={dashboard.navigate}
        onLogout={dashboard.requestLogout}
      >
        {dashboard.page === 'Dashboard' && <DashboardPage
          user={currentUser}
          employees={dashboard.employees}
          activities={dashboard.activities}
          statistics={dashboard.statistics}
          onSelectStatistic={dashboard.selectStatistic}
          onAddEmployee={dashboard.openAddEmployee}
          onViewEmployee={dashboard.viewEmployee}
          onViewEmployees={() => dashboard.navigate('Medewerkers')}
          onViewActivities={dashboard.viewActivities}
        />}
        {dashboard.page === 'Medewerkers' && <EmployeesPage
          total={dashboard.employees.length}
          employees={dashboard.filteredEmployees}
          roles={dashboard.roles}
          search={dashboard.search}
          roleFilter={dashboard.roleFilter}
          statusFilter={dashboard.statusFilter}
          onRoleFilterChange={dashboard.setRoleFilter}
          onStatusFilterChange={dashboard.setStatusFilter}
          onAddEmployee={dashboard.openAddEmployee}
          onViewEmployee={dashboard.viewEmployee}
        />}
        {dashboard.page === 'Rollen' && <RolesPage
          roles={dashboard.roles}
          employees={dashboard.employees}
          onViewRole={dashboard.viewRole}
        />}
      </DashboardLayout>
      <Toast message={dashboard.notice} onDismiss={dashboard.dismissNotice} />
      <AppDialogs
        modal={dashboard.modal}
        roles={dashboard.roles}
        activities={dashboard.activities}
        formError={dashboard.formError}
        onClose={dashboard.closeModal}
        onAddEmployee={dashboard.addEmployee}
        onViewRole={dashboard.viewRole}
        onConfirmLogout={dashboard.confirmLogout}
      />
    </>
  )
}

export default App
