import { useEffect, useState } from 'react'
import { initialActivities, initialEmployees, roles } from '../data/dashboard.js'

export default function useDashboard() {
  const [page, setPage] = useState('Dashboard')
  const [employees, setEmployees] = useState(initialEmployees)
  const [activities, setActivities] = useState(initialActivities)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Alle rollen')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const [signedIn, setSignedIn] = useState(true)
  const [formError, setFormError] = useState('')

  const activeCount = employees.filter((employee) => employee.status === 'Actief').length
  const statistics = [
    { label: 'Medewerkers', value: employees.length, icon: 'users', tone: 'green', target: 'Medewerkers' },
    { label: 'Rollen', value: roles.length, icon: 'shield', tone: 'yellow', target: 'Rollen' },
    { label: 'Actieve accounts', value: activeCount, icon: 'user', tone: 'green', target: 'Medewerkers', status: 'Actief' },
    { label: 'Uitnodigingen', value: employees.length - activeCount, icon: 'mail', tone: 'yellow', target: 'Medewerkers', status: 'Uitgenodigd' },
  ]
  const normalizedSearch = search.trim().toLocaleLowerCase('nl')
  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.email} ${employee.role}`.toLocaleLowerCase('nl').includes(normalizedSearch)
    && (roleFilter === 'Alle rollen' || employee.role === roleFilter)
    && (statusFilter === 'Alle statussen' || employee.status === statusFilter),
  )

  useEffect(() => { document.title = `${page} · Boon Edam` }, [page])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 5000)
    return () => clearTimeout(timer)
  }, [notice])

  function navigate(destination) {
    setPage(destination)
    setSearch('')
    setRoleFilter('Alle rollen')
    setStatusFilter('Alle statussen')
  }

  function openAddEmployee() {
    setFormError('')
    setModal({ type: 'add' })
  }

  function updateSearch(value) {
    setSearch(value)
    if (value) {
      setPage('Medewerkers')
      setRoleFilter('Alle rollen')
      setStatusFilter('Alle statussen')
    }
  }

  function submitSearch() {
    setPage('Medewerkers')
    setRoleFilter('Alle rollen')
    setStatusFilter('Alle statussen')
  }

  function selectStatistic(statistic) {
    navigate(statistic.target)
    if (statistic.status) setStatusFilter(statistic.status)
  }

  function viewRole(role) {
    navigate('Medewerkers')
    setRoleFilter(role)
    setModal(null)
  }

  function addEmployee(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name').trim()
    const email = data.get('email').trim().toLowerCase()
    if (!name) { setFormError('Vul de naam van de medewerker in.'); return }
    if (employees.some((employee) => employee.email.toLowerCase() === email)) { setFormError('Er bestaat al een medewerker met dit e-mailadres.'); return }
    const id = Date.now()
    setEmployees((previous) => [{ id, name, email, role: data.get('role'), status: 'Uitgenodigd' }, ...previous])
    setActivities((previous) => [{ id, text: `${name} is uitgenodigd`, time: 'Zojuist', icon: 'user-plus', invited: true }, ...previous])
    setModal(null)
    setNotice(`${name} is toegevoegd aan dit voorbeeld. Er is geen e-mail verstuurd.`)
  }

  function confirmLogout() {
    setSignedIn(false)
    setModal(null)
  }

  function openDashboard() {
    setSignedIn(true)
    navigate('Dashboard')
  }

  return {
    page, employees, activities, roles, statistics, filteredEmployees, search,
    roleFilter, statusFilter, modal, notice, signedIn, formError,
    navigate, openAddEmployee, updateSearch, submitSearch, selectStatistic,
    viewRole, addEmployee, confirmLogout, openDashboard,
    setRoleFilter, setStatusFilter,
    viewEmployee: (employee) => setModal({ type: 'employee', employee }),
    viewActivities: () => setModal({ type: 'activity' }),
    requestLogout: () => setModal({ type: 'logout' }),
    closeModal: () => setModal(null),
    dismissNotice: () => setNotice(''),
  }
}
