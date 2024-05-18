import type { Browser, BrowserContext, Page } from "@playwright/test"
import { expect } from "@playwright/test"

export type TestArgs = {
  page: Page
  context: BrowserContext
  browser: Browser
}

export const createFlagBuilderComponentPageObject = (testArgs: TestArgs) => {
  const { page } = testArgs
  const self = {
    goTo: async () => {
      return await page.goto("/")
    },
    addContext: async () => {
      await page.getByRole("button", { name: "Add Context" }).click()
    },
    openContextKindSelection: async () => {
      await page.getByLabel("Context Kind").click()
      await expect(page.getByRole("dialog")).toBeVisible()

      return () => self.closeContextKindSelection()
    },
    closeContextKindSelection: async () => {
      await page.getByLabel("Context Kind").click()
      await expect(page.getByRole("dialog")).not.toBeVisible()
    },
    searchContextKind: async (kind: string) => {
      await page.getByPlaceholder("Search context kind...").fill(kind)
    },
    searchAndSetContextKind: async (kind: string) => {
      await self.searchContextKind(kind)
      await self.setContextKind(kind)
    },
    setContextKind: async (kind: string) => {
      const button = page.getByRole("button", {
        name: `Add "${kind}" Context +`,
      })
      await button.click()
    },
    expect: {
      contextKindSelected: async (kind: string) => {
        const contextKindButton = page
          .getByLabel("Context Kind")
          .getByText(kind)

        await expect(contextKindButton).toBeVisible()

        const option = page.getByRole("option", {
          name: kind,
          exact: true,
        })

        await expect(option).toBeVisible()
        await expect(option).toHaveAttribute("data-selected", "true")
        await expect(option.getByRole("img")).toBeVisible()
      },
      contextKindUnselected: async (kind: string) => {
        const option = page.getByRole("option", { name: kind, exact: true })
        await expect(option).toHaveAttribute("data-selected", "false")
      },
      contextKindOption: async (kind: string) => {
        const option = page.getByRole("option", { name: kind, exact: true })
        await expect(option).toBeVisible()
      },
    },
  }
  return self
}
