import { trace } from "@opentelemetry/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const GET = async () => {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("clearFlagContextRequest", async () => {
      cookies().delete("featureContext")

      return redirect("/")
    })
}
