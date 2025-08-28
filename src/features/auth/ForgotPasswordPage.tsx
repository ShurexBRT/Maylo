import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useForm } from 'react-hook-form'
import { useForgotPassword } from './hooks'
import '@/styles/globals.css'


export default function ForgotPasswordPage() {
  const { drawerOpen, setDrawer } = useUI()
  const { register, handleSubmit } = useForm<{ email: string }>()
  const forgot = useForgotPassword()

  const onSubmit = async (v: { email: string }) => {
    try {
      await forgot.mutateAsync(v.email)
      alert('Check your email for the reset link.')
    } catch {
      alert('Could not send email.')
    }
  }

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
      
      <main className="max-w-sm mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Forgot password</h1>
        <form className="card p-4 space-y-3" onSubmit={handleSubmit(onSubmit)} onClick={(e)=>e.stopPropagation()}>
          <input {...register('email')} type="email" placeholder="Your email" className="w-full border p-3 rounded-lg"/>
          <button className="btn-primary w-full" disabled={forgot.isPending}>
            {forgot.isPending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </main>
    </div>
  )
}
