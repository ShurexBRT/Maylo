import { supabase } from '@/lib/supabase'
import { disableGuest } from '@/lib/guest'

export async function signOut() {
  // za svaki slučaj očisti guest state
  disableGuest()
  await supabase.auth.signOut()
}

export async function signOutTo(path = '/welcome') {
  await signOut()
  // hard redirect (stabilnije u PWA i posle auth promene)
  window.location.href = path
}
