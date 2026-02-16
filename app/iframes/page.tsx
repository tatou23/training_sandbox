import { Suspense } from "react"
import IframesClient from "./iframes-client"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <IframesClient />
    </Suspense>
  )
}