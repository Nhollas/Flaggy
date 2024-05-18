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
    searchAttribute: async (attribute: string) => {
      await page.getByPlaceholder("Search attribute...").fill(attribute)
    },
    setAttribute: async (attribute: string) => {
      await page.getByRole("button", { name: `Add "${attribute}" +` }).click()
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
    expect: {
      attributeIsInSelection: async (attribute: string) => {
        const dialog = page.getByRole("dialog")
        const option = dialog.getByRole("option", { name: attribute })

        await expect(option).toBeVisible()

        return option
      },
      attributesExistInSelection: async (
        attributes: string[],
        config: { exact: boolean } | undefined,
      ) => {
        const dialog = page.getByRole("dialog")
        const options = await dialog.getByRole("option").all()

        for (const attribute of attributes) {
          const option = options.find((o) => o.getByText(attribute))!
          console.log("option", option)

          expect(option, {
            message: `Option for attribute "${attribute}" not found.`,
          }).toBeVisible()
        }

        if (config?.exact) {
          expect(
            options.length,
            "Options found on page were not exactly matched to the attributes you provided.",
          ).toBe(attributes.length)
        }
      },
      attributeTableExistsWithValue: async (
        attribute: string,
        { value }: { value: string },
      ) => {
        const attributeRow = page.getByRole("row", { name: attribute })
        await expect(attributeRow).toBeVisible()
        await expect(attributeRow.getByRole("textbox")).toHaveValue(value)

        return attributeRow
      },
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
        const contextKindButton = page
          .getByLabel("Context Kind")
          .getByText(kind)

        await expect(contextKindButton).not.toBeVisible()

        const option = page.getByRole("option", {
          name: kind,
          exact: true,
        })

        await expect(option).toBeVisible()
        await expect(option).toHaveAttribute("data-selected", "false")
        await expect(option.getByRole("img")).not.toBeVisible()
      },
      contextKindOption: async (kind: string) => {
        const option = page.getByRole("option", { name: kind, exact: true })
        await expect(option).toBeVisible()
      },
    },
  }
  return self
}
