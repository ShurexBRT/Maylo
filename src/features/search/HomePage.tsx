import PopularBranches from './PopularBranches'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
// dodaj na vrhu


import '@/styles/globals.css'
import {
  fetchBranches,
  fetchCountries,
  fetchCitiesByCountry,
  type Branch,
  type Country,
  type City,
} from './api'

export default function HomePage() {
  const navigate = useNavigate()

  // lokalni state filtera
  const [branch, setBranch] = useState<Branch | ''>('')
  const [country, setCountry] = useState<Country | ''>('')
  const [city, setCity] = useState<City | ''>('')

  // učitavanje grana i zemalja odmah
  const branchesQ = useQuery({ queryKey: ['branches'], queryFn: fetchBranches })
  const countriesQ = useQuery({ queryKey: ['countries'], queryFn: fetchCountries })

  // učitavanje gradova tek kada postoji country
  const {
    data: cities = [],
    isFetching: citiesLoading,
    refetch: refetchCities,
  } = useQuery({
    queryKey: ['cities', country],
    queryFn: () => fetchCitiesByCountry(country as string),
    enabled: !!country, // <- ključna linija: ne pali query dok nema zemlje
    staleTime: 1000 * 60 * 5,
  })

  // kad se promeni country, resetuj city i refetch-uj
  useEffect(() => {
    setCity('')
    if (country) refetchCities()
  }, [country, refetchCities])

  const canSubmit = useMemo(() => !!branch || !!country || !!city, [branch, country, city])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // pravimo query string sa samo popunjenim poljima
    const params = new URLSearchParams()
    if (branch) params.set('branch', branch)
    if (country) params.set('country', country)
    if (city) params.set('city', city)

    navigate(`/results?${params.toString()}`)
  }

  return (
  <section className="mx-auto max-w-3xl px-4 py-6">
    <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 leading-tight">
      Local services in the <span className="text-blue-600">language you understand</span>
    </h1>
    <p className="text-slate-600 mt-1 mb-6">Find trusted professionals near you</p>

    <form onSubmit={onSubmit} className="space-y-4">
      {/* Branch */}
      <div>
        <label className="block text-sm font-medium mb-1">Branch</label>
        <select
          className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Any branch</option>
          {branchesQ.data?.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <select
          className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Any country</option>
          {countriesQ.data?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* City – disabled dok nema country */}
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <select
          className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none ${
            !country ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'focus:ring-2 focus:ring-blue-500'
          }`}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!country}
        >
          <option value="">{country ? 'Any city' : 'Select country first'}</option>
          {country && cities.map((ct) => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>
        {country && citiesLoading && (
          <p className="text-sm text-slate-500 mt-1">Loading cities…</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full md:w-auto inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold
          ${canSubmit ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-slate-600 cursor-not-allowed'}`}
      >
        Search
      </button>
    </form>

    {/* Popular branches grid */}
    <PopularBranches
      onPick={(b) => {
        setBranch(b)
        // odmah vodi na rezultate sa izabranom granom (i opcionalno zemljom/gradom)
        const params = new URLSearchParams()
        params.set('branch', b)
        if (country) params.set('country', country)
        if (city) params.set('city', city)
        navigate(`/results?${params.toString()}`)
      }}
    />
  </section>
)
}
