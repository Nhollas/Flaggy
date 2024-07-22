import { test as base } from "@playwright/test"

import { setupNextServer } from "../setup"
import { buildLocalUrl, createTestUtils } from "../utils"

export const test = base.extend<
  {
    utils: ReturnType<typeof createTestUtils>
    po: ReturnType<typeof createTestUtils>["po"]
  },
  {
    port: string
  }
>({
  baseURL: async ({ port }, use) => {
    await use(buildLocalUrl(port))
  },
  utils: async ({ page }, use) => {
    const u = createTestUtils({ page })

    await use(u)
  },
  po: async ({ utils }, use) => {
    await use(utils.po)
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
