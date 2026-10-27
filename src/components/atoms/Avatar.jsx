export default function Avatar({ name = '', initials, size = 'default' }) {
  const displayInitials = initials ?? name.split(' ')
    .filter((_, index, parts) => index === 0 || index === parts.length - 1)
    .map((part) => part[0])
    .join('')

  return <span className={`avatar${size === 'default' ? '' : ` avatar-${size}`}`}>{displayInitials}</span>
}
