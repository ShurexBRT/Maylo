import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSignup, useOAuth } from './hooks'

type Form = {
  full_name: string
  email: string
  password: string
  role_provider: boolean
}

export default function SignupPage() {
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const signup = useSignup()
  const oauth = useOAuth()
  const { register, handleSubmit } = useForm<Form>()

  const onSubmit = async (v: Form) => {
    try {
      await signup.mutateAsync({
        email: v.email,
        password: v.password,
        full_name: v.full_name,
        role: v.role_provider ? 'provider' : 'user',
      })
      alert('Check your email to confirm your account.')
      nav('/welcome')
    } catch (e) {
      alert('Signup failed.')
    }
  }

  const social = (p: 'google'|'apple'|'facebook') => () => oauth.mutate(p)

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
      <Header /><Drawer />
      <main className="max-w-sm mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Create account</h1>

        <form className="card p-4 space-y-3" onSubmit={handleSubmit(onSubmit)} onClick={(e)=>e.stopPropagation()}>
          <input {...register('full_name')} placeholder="Full name" className="w-full border p-3 rounded-lg"/>
          <input {...register('email')} type="email" placeholder="Email" className="w-full border p-3 rounded-lg"/>
          <input {...register('password')} type="password" placeholder="Password" className="w-full border p-3 rounded-lg"/>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('role_provider')} /> I’m a service provider
          </label>
          <button className="btn-primary w-full" disabled={signup.isPending}>
            {signup.isPending ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <div className="text-center my-4 text-slate-500">or</div>

        <div className="grid gap-2">
          <button onClick={social('google')} className="btn-secondary">Continue with Google</button>
          <button onClick={social('apple')} className="btn-secondary">Continue with Apple</button>
          <button onClick={social('facebook')} className="btn-secondary">Continue with Facebook</button>
        </div>

        <p className="mt-6 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
        </p>
      </main>
    </div>
  )
}
