import { test as base } from "@playwright/test"
import { type SetupServer } from "msw/node"

import { server } from "@/test/server"

import { setupNextServer } from "../setup"
import { buildLocalUrl } from "../utils"

export const test = base.extend<
  object,
  {
    port: string
    requestInterceptor: SetupServer
  }
>({
  baseURL: async ({ port }, use) => {
    await use(buildLocalUrl(port))
  },
  port: [
    async ({}, use) => {
      const port = await setupNextServer()

      await use(port)
    },
    { auto: true, scope: "worker" },
  ],
  requestInterceptor: [
    async ({}, use) => {
      server.listen({ onUnhandledRequest: "warn" })

      await use(server)

      server.resetHandlers()
      server.close()
    },
    {
      scope: "worker",
    },
  ],
})

export default test
