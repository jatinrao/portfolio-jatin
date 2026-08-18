interface StatItemProps {
  value?: string
  number?: string
  label: string
}

export default function StatItem({ value, number, label }: StatItemProps) {
  const display = value ?? number ?? ''
  return (
    <div className="hero-stat">
      <span className="hero-private">
        <span className="hero-stat-value hero-private-live">{display}</span>
      </span>
      <span className="hero-private">
        <span className="hero-stat-label hero-private-live">{label}</span>
      </span>
    </div>
  )
}
