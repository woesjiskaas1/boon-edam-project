export default function Avatar({ name, className = "profile-avatar", firstAndLast = false }) {
  const words = name.trim().split(/\s+/);
  const initials = words
    .filter((_, index) => !firstAndLast || index === 0 || index === words.length - 1)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return <span className={className} aria-hidden="true">{initials}</span>;
}
