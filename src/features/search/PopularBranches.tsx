import { useQuery } from '@tanstack/react-query'
import { fetchPopularBranches, type PopularBranch } from './api'
import * as I from 'lucide-react'

type Props = {
  onPick: (branch: string) => void
}

/** Mapiranje kategorija na Lucide ikone */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  frizer: I.Scissors,
  'hair stylist': I.Scissors,
  prevodilac: I.BookOpenCheck,
  'translator': I.BookOpenCheck,
  'auto servis': I.Car,
  'car service': I.Car,
  elektricar: I.Zap,
  vodoinstalater: I.Wrench,
  doktor: I.Stethoscope,
  lekar: I.Stethoscope,
  advokat: I.Gavel,
  'it usluge': I.Cpu,
}

function BranchCard({ item, onClick }: { item: PopularBranch; onClick: () => void }) {
  const Icon = ICONS[item.name.toLowerCase()] ?? I.BadgeInfo
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition shadow-sm hover:shadow-md p-3 text-left w-full"
    >
      <Icon className="w-6 h-6 text-blue-600 shrink-0" />
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-xs text-slate-500">{item.count} providers</div>
      </div>
      <I.ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
  )
}

export default function PopularBranches({ onPick }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-branches'],
    queryFn: () => fetchPopularBranches(6),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return null
  if (!data?.length) return null

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Popular branches</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.map((b) => (
          <BranchCard key={b.name} item={b} onClick={() => onPick(b.name)} />
        ))}
      </div>
    </section>
  )
}
