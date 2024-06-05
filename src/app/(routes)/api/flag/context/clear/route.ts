import { trace } from "@opentelemetry/api"
import { cookies, draftMode } from "next/headers"

export const GET = async () => {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("clearFlagContextRequest", async (span) => {
      try {
        cookies().delete("featureContext")
        draftMode().disable()

        return Response.json({}, { status: 200 })
      } finally {
        span.end()
      }
    })
}
