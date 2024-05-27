"use client"

import { asyncWithLDProvider } from "launchdarkly-react-client-sdk"
import { cache, use } from "react"

import {
  launchDarklyContextAdapter,
  FlagContext,
  FlagContextDetails,
} from "@/app/features/flags"

const AsyncLDProviderPromise = cache((context: FlagContext) =>
  asyncWithLDProvider({
    clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID!,
    context: launchDarklyContextAdapter(context),
  }),
)

export default function AsyncLDProvider({
  children,
  flagContext,
}: {
  children: React.ReactNode
  flagContext: FlagContext
}) {
  const LDDynaProvider = use(AsyncLDProviderPromise(flagContext))

  return (
    <LDDynaProvider>
      {flagContext.contexts.length > 0 && (
        <FlagContextDetails flagContext={flagContext} />
      )}
      {children}
    </LDDynaProvider>
  )
}
