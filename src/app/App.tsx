
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import '@/lib/i18n'

import HomePage from '@/features/search/HomePage'
import ResultsPage from '@/features/results/ResultsPage'
import ProfilePage from '@/features/profile/ProfilePage'
import SavedPage from '@/features/saved/SavedPage'

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading…</div>}>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/results" element={<ResultsPage/>} />
            <Route path="/profile/:id" element={<ProfilePage/>} />
            <Route path="/saved" element={<SavedPage/>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
