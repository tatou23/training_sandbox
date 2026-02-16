import { Suspense } from "react"
import AuthClient from "./auth-client.tsx"

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <AuthClient />
    </Suspense>
  )
}
