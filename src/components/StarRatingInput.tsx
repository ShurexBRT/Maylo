// src/components/StarRatingInput.tsx
import { useState } from 'react'

type Props = {
  value?: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRatingInput({ value = 0, onChange, size = 'lg' }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value
  const cls = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'

  return (
    <div className={`flex items-center gap-1 ${cls}`} aria-label="Choose rating">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n>1?'s':''}`}
          className={n <= display ? 'text-amber-500' : 'text-slate-300'}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange?.(n)}
        >
          ★
        </button>
      ))}
    </div>
  )
}
