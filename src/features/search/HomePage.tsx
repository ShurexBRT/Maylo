
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function HomePage(){
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const [branch, setBranch] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  const submit = (e:React.FormEvent)=>{
    e.preventDefault()
    const p = new URLSearchParams()
    if(branch) p.set('branch', branch)
    if(country) p.set('country', country)
    if(city) p.set('city', city)
    nav(`/results?${p.toString()}`)
  }

  return (
    <div onClick={()=>drawerOpen && setDrawer(false)}>
      <Header/>
      <Drawer/>
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-1">Local services in the <span className="text-blue-600">language you understand</span></h1>
        <p className="text-slate-600 mb-6">Find trusted professionals near you</p>

        <form onSubmit={submit} className="grid gap-3">
          <select className="border rounded-lg p-3" value={branch} onChange={e=>setBranch(e.target.value)}>
            <option value="">Any branch</option>
            <option value="frizer">Frizer</option>
          </select>
          <select className="border rounded-lg p-3" value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="">Any country</option>
            <option value="Nemačka">Nemačka</option>
          </select>
          <select className="border rounded-lg p-3" value={city} onChange={e=>setCity(e.target.value)}>
            <option value="">Any city</option>
            <option value="Berlin">Berlin</option>
          </select>
          <button className="btn-primary" type="submit">Search</button>
        </form>

        <section className="mt-8">
          <h2 className="font-semibold mb-3">Popular branches</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="card p-4 text-center" onClick={()=>{ setBranch('frizer'); submit(new Event('submit') as any); }}>
              <div className="text-3xl mb-2">✂️</div>
              <div className="font-medium">Frizer</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
