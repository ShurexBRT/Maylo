import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLogin, useOAuth } from './hooks'
import '@/styles/globals.css'


type Form = { email: string; password: string }

export default function LoginPage() {
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const login = useLogin()
  const oauth = useOAuth()
  const { register, handleSubmit } = useForm<Form>()

  const onSubmit = async (v: Form) => {
    try {
      await login.mutateAsync({ email: v.email, password: v.password })
      nav('/')
    } catch (e) {
      alert('Login failed. Check credentials.')
    }
  }

  const social = (p: 'google'|'apple'|'facebook') => () => oauth.mutate(p)

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
     
      <main className="max-w-sm mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Log in</h1>

        <form className="card p-4 space-y-3" onSubmit={handleSubmit(onSubmit)} onClick={(e)=>e.stopPropagation()}>
          <input {...register('email')} type="email" placeholder="Email" className="w-full border p-3 rounded-lg"/>
          <input {...register('password')} type="password" placeholder="Password" className="w-full border p-3 rounded-lg"/>
          <button className="btn-primary w-full" disabled={login.isPending}>
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
          <Link to="/forgot" className="text-blue-600 text-sm">Forgot password?</Link>
        </form>

        <div className="text-center my-4 text-slate-500">or</div>

        <div className="grid gap-2">
          <button onClick={social('google')} className="btn-secondary">Continue with Google</button>
          <button onClick={social('apple')} className="btn-secondary">Continue with Apple</button>
          <button onClick={social('facebook')} className="btn-secondary">Continue with Facebook</button>
        </div>

        <p className="mt-6 text-sm text-center">
          Don’t have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </main>
    </div>
  )
}
