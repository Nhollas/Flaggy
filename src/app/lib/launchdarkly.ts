import * as LaunchDarkly from "@launchdarkly/node-server-sdk"
import { LDClient } from "@launchdarkly/node-server-sdk"
import { trace, SpanStatusCode } from "@opentelemetry/api"

import {
  Context,
  FlagContext,
  IFeatureFlagProvider,
} from "@/app/features/flags"

import { env } from "./env"

const { LAUNCHDARKLY_SDK_KEY } = env
let launchDarklyClient: LDClient
async function initialize() {
  launchDarklyClient = LaunchDarkly.init(LAUNCHDARKLY_SDK_KEY)
  await launchDarklyClient.waitForInitialization()
}
export async function getClient() {
  if (launchDarklyClient) {
    await launchDarklyClient.waitForInitialization()
    return launchDarklyClient
  }
  await initialize()
  return launchDarklyClient
}

export async function getVariation<T>(
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

export const LaunchDarklyFlagProvider: IFeatureFlagProvider = {
  getValue<T>(
    flag: string,
    flagContext: FlagContext,
    defaultValue: T,
  ): Promise<T> {
    let context: LaunchDarkly.LDContext
    if (flagContext.contexts.length === 0) {
      context = {
        kind: "user",
        anonymous: true,
        key: "anonymous",
      }
    } else if (flagContext.contexts.length === 1) {
      context = applySingleContext(flagContext.contexts[0]!)
    } else {
      context = applyMultiContext(flagContext.contexts)
    }

    return getVariation(flag, context, defaultValue)
  },
}

const applySingleContext = (context: Context): LaunchDarkly.LDContext => {
  const { contextKind, contextKey, attributes } = context
  return {
    kind: contextKind,
    key: contextKey,
    ...attributes,
  }
}

const applyMultiContext = (contexts: Context[]): LaunchDarkly.LDContext => {
  return {
    kind: "multi",
    ...contexts.reduce((acc, context) => {
      const { contextKind, contextKey, attributes } = context
      return {
        ...acc,
        [contextKind]: {
          key: contextKey,
          ...attributes,
        },
      }
    }, {}),
  }
}
