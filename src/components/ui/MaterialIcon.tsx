interface MaterialIconProps {
  name: string
  className?: string
}

export const MaterialIcon = ({ name, className = '' }: MaterialIconProps) => {
  return <span className={`material-symbols-outlined ${className}`} aria-hidden="true">{name}</span>
}
