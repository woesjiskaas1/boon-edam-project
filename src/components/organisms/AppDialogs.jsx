import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'
import Dialog from '../molecules/Dialog.jsx'
import ActivityList from './ActivityList.jsx'
import EmployeeForm from './EmployeeForm.jsx'
import EmployeeProfile from './EmployeeProfile.jsx'

export default function AppDialogs({ modal, roles, activities, formError, onClose, onAddEmployee, onViewRole, onConfirmLogout }) {
  if (!modal) return null

  switch (modal.type) {
    case 'add':
      return (
        <Dialog title="Medewerker toevoegen" onClose={onClose}>
          <p className="dialog-intro">Voeg een medewerker toe en kies een passende rol.</p>
          <EmployeeForm roles={roles} error={formError} onSubmit={onAddEmployee} onCancel={onClose} />
        </Dialog>
      )
    case 'employee':
      return (
        <Dialog title="Medewerkergegevens" onClose={onClose}>
          <EmployeeProfile employee={modal.employee} onViewRole={onViewRole} onClose={onClose} />
        </Dialog>
      )
    case 'activity':
      return (
        <Dialog title="Alle recente activiteit" className="activity-dialog" onClose={onClose}>
          <ActivityList activities={activities} />
        </Dialog>
      )
    case 'logout':
      return (
        <Dialog title="Wil je uitloggen?" onClose={onClose}>
          <p className="dialog-intro">Je verlaat het voorbeelddashboard. Je kunt het daarna opnieuw openen.</p>
          <div className="dialog-actions">
            <Button variant="secondary" onClick={onClose}>Annuleren</Button>
            <Button onClick={onConfirmLogout}><Icon name="logout" size={18} />Uitloggen</Button>
          </div>
        </Dialog>
      )
    default:
      return null
  }
}
