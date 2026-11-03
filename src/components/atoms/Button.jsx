const variantClasses = {
  primary: "primary-button",
  secondary: "secondary-button",
  link: "link-button",
  pagination: "pagination-button",
};

export default function Button({ type = "button", variant, className = "", ...props }) {
  const classes = [variantClasses[variant], className].filter(Boolean).join(" ");

  return <button type={type} className={classes || undefined} {...props} />;
}
