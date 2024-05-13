import { trace } from "@opentelemetry/api"
import { cookies } from "next/headers"
import { z } from "zod"

import { getFlagContextRequestSchema } from "@/app/features/flags"
// import { env } from "@/app/lib/env"
// const { FLAG_SECRET } = env

export const GET = async (request: Request) => {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("getFlagContextRequest", async (span) => {
      try {
        const { searchParams } = new URL(request.url)

        // const flagSecret = searchParams.get("flagSecret")

        // if (flagSecret !== FLAG_SECRET) {
        //   return new Response("Invalid Secret", { status: 401 })
        // }

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

        console.log("redirectUrl", redirectUrl)

        if (!redirectUrl) {
          throw new Error("redirectUrl query parameter was not provided.")
        }

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
      }
    })
}
