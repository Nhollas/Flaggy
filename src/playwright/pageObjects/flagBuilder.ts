import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

export type TestArgs = {
  page: Page
}

export const createFlagBuilderPageObject = (testArgs: TestArgs) => {
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
      await expect(option.getByRole("img")).toBeVisible()
    },
    expectOptionIsUnselected: async (optionName: string) => {
      const option = await internal.expectOptionIsVisible(optionName)
      await expect(option.getByRole("img")).not.toBeVisible()
    },
    expectOptionsAreVisible: async (
      options: string[],
      config: { exact: boolean } | undefined,
    ) => {
      const dialog = page.getByRole("dialog")
      const optionList = await dialog.getByRole("option").all()

      for (const option of options) {
        await internal.expectOptionIsVisible(option)
      }

      if (config?.exact) {
        expect(options.length).toBe(optionList.length)
      }
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
    pastePreloadedState: async (url: string) => {
      /* # https://github.com/microsoft/playwright/issues/24039
        await page.evaluate(() => navigator.clipboard.writeText(url))

        Does not work and is currently a known bug when using headless chromium.
      */
      const redirectUrlInput = page.getByPlaceholder("Redirect Path")

      await redirectUrlInput.fill(url)
      await redirectUrlInput.press("ControlOrMeta+a")
      await redirectUrlInput.press("ControlOrMeta+c")

      await page
        .getByPlaceholder("Preload State With Url (only pasting allowed).")
        .press("ControlOrMeta+v")
    },
    setupSingleContextExample: async () => {
      await self.goTo()
      await self.clickAddContext()
      await self.openAttributesDropdown()
      await self.searchAttribute("Middle Name")
      await self.clickAddCustomAttribute("Middle Name")
    },
    clickViewContext: async () => {
      await page.getByRole("button", { name: "View Context" }).click()
    },
    clickClearContext: async () => {
      await page.getByRole("button", { name: "Clear Context" }).click()
    },
    clickGenerateUrl: async () => {
      await page.getByRole("button", { name: "Generate Url" }).click()
    },
    clickAddContext: async () => {
      await page.getByRole("button", { name: "Add Context" }).click()
    },
    searchAttribute: async (attribute: string) => {
      await page.getByPlaceholder("Search attribute...").fill(attribute)
    },
    clickAddCustomAttribute: async (attribute: string) => {
      await page
        .getByRole("button", { name: `Add "${attribute}" Attribute +` })
        .click()
    },
    openAttributesDropdown: async () => {
      await page.getByLabel("Attributes").click()
      await expect(page.getByRole("dialog")).toBeVisible()
    },
    closeAttributesDropdown: async () => {
      await page.getByLabel("Attributes").click()
      await expect(page.getByRole("dialog")).not.toBeVisible()
    },
    openContextKindDropdown: async () => {
      await page.getByLabel("Context Kind").click()
      await expect(page.getByRole("dialog")).toBeVisible()
    },
    closeContextKindDropdown: async () => {
      await page.getByLabel("Context Kind").click()
      await expect(page.getByRole("dialog")).not.toBeVisible()
    },
    searchContextKind: async (kind: string) => {
      await page.getByPlaceholder("Search context kind...").fill(kind)
    },
    clickAddCustomContextKind: async (kind: string) => {
      await page
        .getByRole("button", {
          name: `Add "${kind}" Context +`,
        })
        .click()
    },
    selectAttribute: async (attribute: string) => {
      await page.getByRole("option", { name: attribute }).click()
    },
    setAttributeValue: async ({
      attribute,
      value,
    }: {
      attribute: string
      value: string
    }) => {
      const attributeRow = page.getByRole("row", { name: attribute })
      const input = attributeRow.getByRole("textbox")
      await input.fill(value)
    },
    expect: {
      viewContextButtonIsHidden: async () => {
        await expect(
          page.getByRole("button", { name: "View Context" }),
        ).not.toBeVisible()
      },
      displayTableIsHidden: async () => {
        await expect(page.getByRole("dialog")).not.toBeVisible()
      },
      attributeOptionIsDisabled: async (attribute: string) => {
        const attr = await internal.expectOptionIsVisible(attribute)
        await expect(attr).toBeDisabled()
      },
      attributeOptionIsSelected: async (attribute: string) => {
        await internal.expectOptionIsSelected(attribute)
      },
      contextKindOptionsAreVisible: async (
        kinds: string[],
        config: { exact: boolean } | undefined,
      ) => {
        await internal.expectOptionsAreVisible(kinds, config)
      },
      attributeOptionsAreVisible: async (
        attributes: string[],
        config: { exact: boolean } | undefined,
      ) => {
        await internal.expectOptionsAreVisible(attributes, config)
      },
      attributeInFormTableWithValue: async ({
        attribute,
        value,
      }: {
        attribute: string
        value: string
      }) => {
        const attributeRow = page.getByRole("row", {
          name: attribute,
        })
        await expect(attributeRow).toBeVisible()
        await expect(attributeRow.getByRole("textbox")).toHaveValue(value)
      },
      itemInDisplayTableWithValue: async ({
        item,
        value,
      }: {
        item: string
        value: string
      }) => {
        const itemRow = page.getByRole("row", { name: item })
        await expect(itemRow).toBeVisible()
        await expect(itemRow.getByText(value)).toBeVisible()
      },
      contextKindInDisplayTable: async (kind: string) => {
        await expect(page.getByText(`Context Kind:${kind}`)).toBeVisible()
      },
      contextKindIsSelected: async (kind: string) => {
        const contextKindButton = page
          .getByLabel("Context Kind")
          .getByText(kind)

        await expect(contextKindButton).toBeVisible()
        await internal.expectOptionIsSelected(kind)
      },
      contextKindIsUnselected: async (kind: string) => {
        const contextKindButton = page
          .getByLabel("Context Kind")
          .getByText(kind)

        await expect(contextKindButton).not.toBeVisible()
        await internal.expectOptionIsUnselected(kind)
      },
    },
    ...page,
  }
  return self
}
