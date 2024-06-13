import { trace } from "@opentelemetry/api"
import { draftMode, cookies } from "next/headers"
import { cache } from "react"

import { getFlagContextRequestSchema } from "../schemas"
import { FlagContext } from "../types"

export const getFlagContext = cache(async (): Promise<FlagContext> => {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("getFlagContext", async (span) => {
      try {
        const { isEnabled } = draftMode()

        span.setAttribute("draftMode.enabled", isEnabled)

        if (!isEnabled) {
          return { contexts: [] }
        }

        const cookieList = cookies()

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
