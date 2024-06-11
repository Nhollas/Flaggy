import { trace } from "@opentelemetry/api"
import { cache } from "react"

import { getFlagContextRequestSchema } from "../schemas"
import { FlagContext } from "../types"

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
