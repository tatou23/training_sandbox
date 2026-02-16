import { Suspense } from "react"
import AuthClient from "app/auth/auth-client"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <AuthClient />
    </Suspense>
  )
}