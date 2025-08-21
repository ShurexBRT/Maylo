import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useForm } from 'react-hook-form'
import { useResetPassword } from './hooks'
import { useNavigate } from 'react-router-dom'

export default function ResetPasswordPage() {
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const reset = useResetPassword()
  const { register, handleSubmit } = useForm<{ password: string }>()

  const onSubmit = async (v: { password: string }) => {
    try {
      await reset.mutateAsync(v.password)
      alert('Password updated. You can sign in now.')
      nav('/login')
    } catch {
      alert('Failed to update password.')
    }
  }

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
      <Header /><Drawer />
      <main className="max-w-sm mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Reset password</h1>
        <form className="card p-4 space-y-3" onSubmit={handleSubmit(onSubmit)} onClick={(e)=>e.stopPropagation()}>
          <input {...register('password')} type="password" placeholder="New password" className="w-full border p-3 rounded-lg"/>
          <button className="btn-primary w-full" disabled={reset.isPending}>
            {reset.isPending ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </main>
    </div>
  )
}
