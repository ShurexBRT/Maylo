// src/features/search/PopularBranches.tsx
import { useQuery } from "@tanstack/react-query";
import type { ComponentType } from "react";
import * as I from "lucide-react";

import { fetchPopularBranches, type PopularBranch } from "./api";

type Props = {
  onPick: (branch: string) => void;
};

/** Mapiranje kategorija na Lucide ikone */
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  frizer: I.Scissors,
  "hair stylist": I.Scissors,
  prevodilac: I.BookOpenCheck,
  translator: I.BookOpenCheck,
  "auto servis": I.Car,
  "car service": I.Car,
  elektricar: I.Zap,
  vodoinstalater: I.Wrench,
  doktor: I.Stethoscope,
  lekar: I.Stethoscope,
  advokat: I.Gavel,
  "it usluge": I.Cpu,
};

function BranchCard({
  item,
  onClick,
}: {
  item: PopularBranch;
  onClick: () => void;
}) {
  const key = item.name.trim().toLowerCase();
  const Icon = ICONS[key] ?? I.BadgeInfo;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left shadow-sm transition hover:bg-slate-100 hover:shadow-md"
    >
      <Icon className="h-6 w-6 shrink-0 text-blue-600" />
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-xs text-slate-500">
          {item.count} providers
        </div>
      </div>
      <I.ChevronRight className="h-4 w-4 text-slate-400" />
    </button>
  );
}

export default function PopularBranches({ onPick }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["popular-branches"],
    queryFn: () => fetchPopularBranches(6),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return null;
  if (!data?.length) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">Popular branches</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.map((b) => (
          <BranchCard
            key={b.name}
            item={b}
            onClick={() => onPick(b.name)}
          />
        ))}
      </div>
    </section>
  );
}
