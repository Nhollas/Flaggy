import dynamic from "next/dynamic"
import { Suspense } from "react"

import { FlagContext } from "../features/flags"

import QueryClientProvider from "./QueryClientProvider"

const AsyncLDProvider = dynamic(() => import("./AsyncWithLDProvider"), {
  ssr: false,
})

const Providers = ({
  children,
  flagContext,
}: {
  children: React.ReactNode
  flagContext: FlagContext
}) => {
  return (
    <Suspense>
      <AsyncLDProvider flagContext={flagContext}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </AsyncLDProvider>
    </Suspense>
  )
}

export default Providers
