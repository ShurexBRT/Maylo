import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCompanies } from './useCompanies'
import { useFavorites, useFavoriteIds } from '@/features/saved/useFavorites'
import type { Company, CompaniesPage } from './api'

export default function ResultsPage() {
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()

  const [params] = useSearchParams()
  const branch  = params.get('branch')  || ''
  const country = params.get('country') || ''
  const city    = params.get('city')    || ''

  // Companies (infinite)
  const q = useCompanies({ branch, country, city })
  const items: Company[] = useMemo(
    () => q.data?.pages.flatMap((p: CompaniesPage) => p.items) ?? [],
    [q.data]
  )

  // Favorites
  const { toggle } = useFavorites()
  const favoriteIds = useFavoriteIds()

  // infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && q.hasNextPage && !q.isFetchingNextPage) {
        q.fetchNextPage()
      }
    }, { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.unobserve(el)
  }, [q.hasNextPage, q.isFetchingNextPage, q.fetchNextPage])

  const openProfile = (id: string) => nav(`/profile/${id}`)
  const onCardClick = (id: string) => () => openProfile(id)
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  const onToggleFav = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await toggle(id)
    } catch (err) {
      const message = (err as Error)?.message || ''
      if (message.includes('Not authenticated')) {
        nav('/login')
      } else {
        console.error(err)
      }
    }
  }

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
      <Header />
      <Drawer />

      <main className="max-w-5xl mx-auto p-4">
        {q.isLoading && <div className="text-center py-12">Loading…</div>}
        {q.isError && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-slate-600">Please try again.</p>
          </div>
        )}

        {!q.isLoading && !q.isError && items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold mb-1">No results found</h2>
            <p className="text-slate-600 mb-4">Try changing filters</p>
            <a href="/" className="btn-primary">Reset filters</a>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((c) => {
              const liked = favoriteIds.has(c.id)
              return (
                <article
                  key={c.id}
                  className="card overflow-hidden cursor-pointer"
                  onClick={onCardClick(c.id)}
                >
                  <div className="mx-4 mt-4 mb-3">
                    <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl aspect-video" />
                  </div>

                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-base">{c.name}</h3>

                      <button
                        aria-label={liked ? 'Remove from favorites' : 'Save to favorites'}
                        onClick={(e) => onToggleFav(e, c.id)}
                        className={`hover:scale-110 transition-transform ${liked ? 'text-red-500' : 'text-slate-400'}`}
                        title={liked ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        ♥
                      </button>
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      {c.category}
                      {Array.isArray(c.languages) && c.languages.length > 0
                        ? ` · ${c.languages.join(', ')}`
                        : null}
                    </div>

                    {Array.isArray(c.languages) && c.languages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {c.languages.map((l) => (
                          <span key={l} className="pill">{l}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-700 mb-3">
                      <span>📍</span>
                      <span>
                        {c.address ? `${c.address}, ` : ''}
                        {c.city}{c.country ? `, ${c.country}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button onClick={stop} aria-label="Call" className="text-blue-600 hover:scale-110 transition-transform">📞</button>
                      <button onClick={stop} aria-label="Email" className="text-blue-600 hover:scale-110 transition-transform">✉️</button>
                      <button onClick={stop} aria-label="Open in maps" className="text-blue-600 hover:scale-110 transition-transform">🗺️</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <div ref={sentinelRef} className="h-12" />
        {q.isFetchingNextPage && items.length > 0 && (
          <div className="text-center py-6 text-slate-600">Loading more…</div>
        )}
      </main>
    </div>
  )
}
