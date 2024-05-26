import { test as base } from "@playwright/test"
import { type SetupServer } from "msw/node"

import { setupNextServer } from "../setup"
import { buildLocalUrl, createTestUtils } from "../utils"

export const test = base.extend<
  {
    utils: ReturnType<typeof createTestUtils>
  },
  {
    port: string
    requestInterceptor: SetupServer
  }
>({
  baseURL: async ({ port }, use) => {
    await use(buildLocalUrl(port))
  },
  utils: async ({ page }, use) => {
    const u = createTestUtils({ page })

    await use(u)
  },
  port: [
    async ({}, use) => {
      const port = await setupNextServer()

      await use(port)
    },
    { auto: true, scope: "worker" },
  ],
})

export default test
