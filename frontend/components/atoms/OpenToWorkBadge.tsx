interface OpenToWorkBadgeProps {
  highlight: string
  label?: string
}

export function OpenToWorkBadge({ highlight, label }: OpenToWorkBadgeProps) {
  return (
    <div className="hero-badge">
      <span className="hero-badge-mark">{highlight}</span>
      {label}
    </div>
  )
}
