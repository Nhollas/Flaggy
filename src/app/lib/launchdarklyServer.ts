import LaunchDarkly, { LDClient } from "@launchdarkly/node-server-sdk"
import { trace, SpanStatusCode } from "@opentelemetry/api"
import { cookies } from "next/headers"
import { cache } from "react"

import {
  FlagContext,
  getFlagContextRequestSchema,
  launchDarklyContextAdapter,
} from "@/app/features/flags"

import { env } from "./env"

const { LAUNCHDARKLY_SDK_KEY } = env
let launchDarklyClient: LDClient
async function initialize() {
  launchDarklyClient = LaunchDarkly.init(LAUNCHDARKLY_SDK_KEY)
  await launchDarklyClient.waitForInitialization()
}
async function getClient() {
  if (launchDarklyClient) {
    await launchDarklyClient.waitForInitialization()
    return launchDarklyClient
  }
  await initialize()
  return launchDarklyClient
}

async function getVariation<T>(
  flag: string,
  context: LaunchDarkly.LDContext,
  defaultValue: T,
): Promise<T> {
  return await trace
    .getTracer("launchdarkly")
    .startActiveSpan("getVariation", async (span) => {
      try {
        const client = await getClient()
        const value = await client.variation(flag, context, defaultValue)

        span.setStatus({ code: SpanStatusCode.OK })
        span.setAttributes({
          flag,
          "flag.value": value,
          context: JSON.stringify(context),
        })

        return value
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "Unexpected error while getting variation",
        })
        span.recordException(new Error(String(error), { cause: error }))

        return defaultValue
      } finally {
        span.end()
      }
    })
}

export const getFlagContext = cache(async (): Promise<FlagContext> => {
  const cookieList = cookies()

  const featureContextCookie = cookieList.get("featureContext")

  if (!featureContextCookie) return { contexts: [] }

  try {
    const featureContext = await getFlagContextRequestSchema.parseAsync(
      featureContextCookie.value,
    )

    return featureContext
  } catch (error) {
    return { contexts: [] }
  }
})

interface IFeatureFlagProvider {
  getValue<T>(
    flag: string,
    flagContext: FlagContext,
    defaultValue: T,
  ): Promise<T>
}

export const LaunchDarklyFlagProvider: IFeatureFlagProvider = {
  getValue<T>(
    flag: string,
    flagContext: FlagContext,
    defaultValue: T,
  ): Promise<T> {
    const context = launchDarklyContextAdapter(flagContext)

    return getVariation(flag, context, defaultValue)
  },
}
