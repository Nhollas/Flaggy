import { trace } from "@opentelemetry/api"
import { cookies, draftMode } from "next/headers"
import { z } from "zod"

import { getFlagContextRequestSchema } from "@/app/features/flags"

export const GET = async (request: Request) => {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("getFlagContextRequest", async (span) => {
      try {
        const { searchParams } = new URL(request.url)

        const data = searchParams.get("data")

        if (!data) {
          return new Response("No context provided", { status: 400 })
        }

        const { contexts } = await getFlagContextRequestSchema.parseAsync(data)

        const oneHour = new Date(Date.now() + 1000 * 60 * 60)
        cookies().set("featureContext", JSON.stringify({ contexts }), {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          expires: oneHour,
        })

        const redirectUrl = searchParams.get("redirectUrl")

        if (!redirectUrl) {
          throw new Error("redirectUrl query parameter was not provided.")
        }

        draftMode().enable()

        return Response.redirect(redirectUrl)
      } catch (error) {
        if (error instanceof z.ZodError) {
          span.addEvent("Validation Errors", {
            issues: error.errors.map((e) => JSON.stringify(e)),
          })

          return Response.json(error.errors, { status: 422 })
        }

        span.recordException(new Error(String(error)))

        return new Response("Internal Server Error", { status: 500 })
      } finally {
        span.end()
      }
    })
}
