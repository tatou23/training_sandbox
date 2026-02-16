import { Suspense } from "react"
import HomeClient from "./home-client"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <HomeClient />
    </Suspense>
  )
}