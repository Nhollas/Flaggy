import { LDContext } from "@launchdarkly/node-server-sdk"
import { trace } from "@opentelemetry/api"
import { cache } from "react"

import { getFlagContextRequestSchema } from "./schemas"
import { Context, FlagContext } from "./types"

export const getFlagContext = cache(async (): Promise<FlagContext> => {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("getFlagContext", async (span) => {
      try {
        const headersImport = await import("next/headers")

        const { isEnabled } = headersImport.draftMode()

        span.setAttribute("draftMode.enabled", isEnabled)

        if (!isEnabled) {
          return { contexts: [] }
        }

        const cookieList = headersImport.cookies()

        const featureContextCookie = cookieList.get("featureContext")

        if (!featureContextCookie) return { contexts: [] }

        const featureContext = await getFlagContextRequestSchema.parseAsync(
          featureContextCookie.value,
        )

        span.setAttributes({
          "feature.context": JSON.stringify(featureContext),
        })

        return featureContext
      } catch (error) {
        span.recordException(new Error(String(error)))
        return { contexts: [] }
      } finally {
        span.end()
      }
    })
})

export const createFlagContextUrl = (
  baseUrl: URL,
  flagContext: FlagContext,
  redirectPath: string,
) => {
  const url = new URL("/api/flag/context", baseUrl)

  const data = JSON.stringify({ contexts: flagContext.contexts })

  url.searchParams.append("data", data)
  url.searchParams.append(
    "redirectUrl",
    new URL(redirectPath, baseUrl).toString(),
  )

  return decodeURIComponent(url.toString())
}

export const launchDarklyContextAdapter = (
  flagContext: FlagContext,
): LDContext => {
  const { contexts } = flagContext

  if (contexts.length === 0) {
    return {
      kind: "user",
      anonymous: true,
      key: "anonymous",
    }
  }

  const [firstContext] = contexts
  if (contexts.length === 1 && firstContext) {
    return applySingleContext(firstContext)
  }

  return applyMultiContext(contexts)
}

const applySingleContext = (context: Context): LDContext => {
  const { kind, attributes } = context
  return {
    kind,
    ...attributes,
  }
}

const applyMultiContext = (contexts: Context[]): LDContext => {
  return {
    kind: "multi",
    ...contexts.reduce((acc, context) => {
      const { kind, attributes } = context
      return {
        ...acc,
        [kind]: {
          ...attributes,
        },
      }
    }, {}),
  }
}
