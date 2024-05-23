import dynamic from "next/dynamic"

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
    <AsyncLDProvider flagContext={flagContext}>
      <QueryClientProvider>{children}</QueryClientProvider>
    </AsyncLDProvider>
  )
}

export default Providers
