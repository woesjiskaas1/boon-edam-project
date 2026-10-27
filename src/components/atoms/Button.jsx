const variants = {
  primary: 'primary-button',
  secondary: 'secondary-button',
  text: 'text-button',
  icon: 'icon-button',
  plain: '',
}

export default function Button({ variant = 'primary', className = '', type = 'button', children, ...props }) {
  return (
    <button type={type} className={[variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </button>
  )
}
