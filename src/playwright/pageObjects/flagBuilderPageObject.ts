import type { Browser, BrowserContext, Page } from "@playwright/test"
import { expect } from "@playwright/test"

export type TestArgs = {
  page: Page
  context: BrowserContext
  browser: Browser
}

export const createFlagBuilderComponentPageObject = (testArgs: TestArgs) => {
  const { page } = testArgs

  const internal = {
    expectOptionIsVisible: async (optionName: string) => {
      const dialog = page.getByRole("dialog")
      const option = dialog.getByRole("option", {
        name: optionName,
        exact: true,
      })

      await expect(option).toBeVisible()

      return option
    },
    expectOptionIsSelected: async (optionName: string) => {
      const option = await internal.expectOptionIsVisible(optionName)
      await expect(option).toHaveAttribute("data-selected", "true")
      await expect(option.getByRole("img")).toBeVisible()
    },
    expectOptionIsUnselected: async (optionName: string) => {
      const option = await internal.expectOptionIsVisible(optionName)
      await expect(option).toHaveAttribute("data-selected", "false")
      await expect(option.getByRole("img")).not.toBeVisible()
    },
  }

  const self = {
    goTo: async () => {
      return await page.goto("/")
    },
    goToGeneratedUrl: async () => {
      const url = await page.evaluate(() => navigator.clipboard.readText())
      return await page.goto(url)
    },
    setupSingleContextExample: async () => {
      await self.goTo()
      await self.addContext()
      await self.openAttributesSelection()
      await self.searchAndSetAttribute("Middle Name")
    },
    viewContext: async () => {
      await page.getByRole("button", { name: "View Context" }).click()
    },
    generateUrl: async () => {
      await page.getByRole("button", { name: "Generate Url" }).click()
    },
    addContext: async () => {
      await page.getByRole("button", { name: "Add Context" }).click()
    },
    searchAttribute: async (attribute: string) => {
      await page.getByPlaceholder("Search attribute...").fill(attribute)
    },
    setAttribute: async (attribute: string) => {
      await page
        .getByRole("button", { name: `Add "${attribute}" Attribute +` })
        .click()
    },
    searchAndSetAttribute: async (attribute: string) => {
      await self.searchAttribute(attribute)
      await self.setAttribute(attribute)
    },
    openAttributesSelection: async () => {
      await page.getByLabel("Attributes").click()
      await expect(page.getByRole("dialog")).toBeVisible()

      return () => self.closeAttributesSelection()
    },
    closeAttributesSelection: async () => {
      await page.getByLabel("Attributes").click()
      await expect(page.getByRole("dialog")).not.toBeVisible()
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
    selectAttribute: async (attribute: string) => {
      await page.getByRole("option", { name: attribute }).click()
    },
    editAttribute: async (attribute: string, value: string) => {
      const attributeRow = page.getByRole("row", { name: attribute })
      const input = attributeRow.getByRole("textbox")
      await input.fill(value)
    },
    // Expectations
    expectAttributeOptionIsVisible: async (attribute: string) => {
      return await internal.expectOptionIsVisible(attribute)
    },
    expectAttributeOptionIsSelected: async (attribute: string) => {
      await internal.expectOptionIsSelected(attribute)
    },
    expectContextKindOptionsAreVisible: async (
      kinds: string[],
      config: { exact: boolean } | undefined,
    ) => {
      const dialog = page.getByRole("dialog")
      const options = await dialog.getByRole("option").all()

      for (const kind of kinds) {
        await internal.expectOptionIsVisible(kind)
      }

      if (config?.exact) {
        expect(options.length).toBe(kinds.length)
      }
    },
    expectAttributeOptionsAreVisible: async (
      attributes: string[],
      config: { exact: boolean } | undefined,
    ) => {
      const dialog = page.getByRole("dialog")
      const options = await dialog.getByRole("option").all()

      for (const attribute of attributes) {
        await internal.expectOptionIsVisible(attribute)
      }

      if (config?.exact) {
        expect(options.length).toBe(attributes.length)
      }
    },
    expectAttributeInTableWithValue: async (
      attribute: string,
      { value }: { value: string },
    ) => {
      const attributeRow = page.getByRole("row", { name: attribute })
      await expect(attributeRow).toBeVisible()
      await expect(attributeRow.getByRole("textbox")).toHaveValue(value)
    },
    expectAttributeInDetailTableWithValue: async (
      attribute: string,
      { value }: { value: string },
    ) => {
      const attributeRow = page.getByRole("row", { name: attribute })
      await expect(attributeRow).toBeVisible()
      await expect(attributeRow.getByText(value)).toBeVisible()

      return attributeRow
    },
    expectContextKindIsSelected: async (kind: string) => {
      const contextKindButton = page.getByLabel("Context Kind").getByText(kind)

      await expect(contextKindButton).toBeVisible()
      await internal.expectOptionIsSelected(kind)
    },
    expectContextKindIsUnselected: async (kind: string) => {
      const contextKindButton = page.getByLabel("Context Kind").getByText(kind)

      await expect(contextKindButton).not.toBeVisible()
      await internal.expectOptionIsUnselected(kind)
    },
    expectContextKindOptionIsVisible: async (kind: string) => {
      return await internal.expectOptionIsVisible(kind)
    },
  }
  return self
}
