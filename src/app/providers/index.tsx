import dynamic from "next/dynamic"

import { FlagContext } from "../features/flags"

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
  return <AsyncLDProvider flagContext={flagContext}>{children}</AsyncLDProvider>
}

export default Providers
