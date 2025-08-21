type Props = {
  value?: number | null
  count?: number | null
}

export default function Rating({ value = 0, count = 0 }: Props) {
  const v = Math.max(0, Math.min(5, Number(value) || 0))
  const full = Math.floor(v)
  const half = v - full >= 0.5
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return '★'
    if (i === full && half) return '☆' // možeš kasnije dodati “half” ikonu
    return '☆'
  })
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-500 text-lg leading-none">{stars.join(' ')}</span>
      <span className="text-sm text-slate-600">{v.toFixed(1)} {count ? `(${count})` : ''}</span>
    </div>
  )
}
