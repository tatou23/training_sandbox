import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { TRAINING_SESSION_COOKIE } from '@/lib/server/trainingAuth'
import { TrainingAdminPage } from '@/components/pages/TrainingAdminPage'

export default function TrainingAdmin() {
  // Défense en profondeur: même si le middleware est contourné,
  // cette page reste inaccessible sans cookie de session interne.
  const expected = process.env.INTERNAL_TRAINING_TOKEN
  const cookieToken = cookies().get(TRAINING_SESSION_COOKIE)?.value

  if (!expected || cookieToken !== expected) {
    notFound()
  }

  return <TrainingAdminPage />
}

