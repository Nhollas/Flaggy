"use client"

import { asyncWithLDProvider } from "launchdarkly-react-client-sdk"
import { cache, use } from "react"

import { FlagContext } from "@/app/features/flags"
import launchDarklyContextAdapter from "@/app/lib/launchdarkly/adapter"

const AsyncLDProviderPromise = cache((context: FlagContext) =>
  asyncWithLDProvider({
    clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID!,
    context: launchDarklyContextAdapter(context),
    timeout: 2.5,
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

  return <LDDynaProvider>{children}</LDDynaProvider>
}
