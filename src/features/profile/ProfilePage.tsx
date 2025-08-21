import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import Rating from '@/components/Rating'
import { useUI } from '@/lib/store'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCompany } from './useCompany'
import { useFavorites, useFavoriteIds } from '@/features/saved/useFavorites'
import { useEffect } from 'react'

export default function ProfilePage(){
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const { id } = useParams<{ id: string }>()
  const q = useCompany(id)

  const { toggle } = useFavorites()
  const favoriteIds = useFavoriteIds()
  const liked = id ? favoriteIds.has(id) : false

  // zatvori drawer klikom po sadržaju
  useEffect(() => {
    if (!drawerOpen) return
    const off = () => setDrawer(false)
    window.addEventListener('click', off)
    return () => window.removeEventListener('click', off)
  }, [drawerOpen, setDrawer])

  const onToggleFav = async () => {
    if (!id) return
    try {
      await toggle(id)
    } catch (err) {
      const msg = (err as Error)?.message || ''
      if (msg.includes('Not authenticated')) {
        nav('/login')
      } else {
        console.error(err)
      }
    }
  }

  const onCall = () => { /* ovde možeš `window.location.href = tel:` ako ima phone */ }
  const onEmail = () => { /* ovde možeš `mailto:` */ }
  const onMaps = () => { /* otvori maps sa adresom */ }

  return (
    <div>
      <Header />
      <Drawer />

      <main className="max-w-4xl mx-auto p-4" onClick={(e) => e.stopPropagation()}>
        {q.isLoading && <div className="text-center py-12">Loading…</div>}
        {q.isError && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-slate-600">Please try again.</p>
          </div>
        )}

        {!q.isLoading && !q.isError && !q.data && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Company not found</h2>
            <Link to="/results" className="btn-primary">Back to results</Link>
          </div>
        )}

        {q.data && (
          <article className="card overflow-hidden">
            {/* Vizuel/placeholder */}
            <div className="p-4">
              <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl aspect-video" />
            </div>

            {/* Header: ime + srce */}
            <div className="px-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold truncate">{q.data.name}</h1>
                <div className="text-slate-600">{q.data.category}</div>
              </div>
              <button
                aria-label={liked ? 'Remove from favorites' : 'Save to favorites'}
                className={`text-2xl hover:scale-110 transition-transform ${liked ? 'text-red-500' : 'text-slate-400'}`}
                onClick={onToggleFav}
                title={liked ? 'Remove from favorites' : 'Save to favorites'}
              >
                ♥
              </button>
            </div>

            {/* Rating + jezici */}
            <div className="px-4 mt-2">
              <Rating value={q.data.rating_avg} count={q.data.rating_count ?? 0} />
              {Array.isArray(q.data.languages) && q.data.languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {q.data.languages.map((l) => <span key={l} className="pill">{l}</span>)}
                </div>
              )}
            </div>

            {/* Adresa */}
            <div className="px-4 mt-3 text-slate-700">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>
                  {q.data.address ? `${q.data.address}, ` : ''}
                  {q.data.city}{q.data.country ? `, ${q.data.country}` : ''}
                </span>
              </div>
            </div>

            {/* CTA dugmići – razmaknuti i “čisti” (bez bordera) */}
            <div className="px-4 py-4 flex flex-wrap items-center gap-4">
              <button onClick={onCall}  className="text-blue-600 hover:scale-110 transition-transform" aria-label="Call">📞 Call</button>
              <button onClick={onEmail} className="text-blue-600 hover:scale-110 transition-transform" aria-label="Email">✉️ Email</button>
              <button onClick={onMaps}  className="text-blue-600 hover:scale-110 transition-transform" aria-label="Open in maps">🗺️ Open in maps</button>

              <div className="flex-1" />

              {/* Write review – lepše dugme */}
              <Link
                to={`/write-review/${q.data.id}`}
                className="btn-primary"
              >
                Write a review
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}
