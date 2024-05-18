import { expect } from "@playwright/test"

import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test("Required attribute 'Key' is added by default", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()

  await u.po.flagBuilder.expect.attributeTableExistsWithValue("key", {
    value: "user-123",
  })
})

test("Required attribute 'Key' cannot be removed", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  await u.po.flagBuilder.openAttributesSelection()
  const attribute = await u.po.flagBuilder.expect.attributeIsInSelection("Key")

  await expect(attribute).toBeDisabled()
})

test("Attributes select has default values", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  await u.po.flagBuilder.openAttributesSelection()
  await u.po.flagBuilder.expect.attributeSelectionOptions(
    [
      "Country",
      "Email",
      "IP Address",
      "Key",
      "Name",
      "Anonymous",
      "First Name",
      "Last Name",
    ],
    { exact: true },
  )
})

test("Attributes can be changed", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
})

test("Attributes can be removed", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
})

test("Attribute values can be edited", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
})

test("Custom attributes can be added", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
})

test("Previously added custom attributes are retained when dismissing the dialog", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  await u.po.flagBuilder.openAttributesSelection()

  const attributesToAdd = ["Middle Name", "Town", "Age"]

  for (const attribute of attributesToAdd) {
    await u.po.flagBuilder.searchAndSetAttribute(attribute)
  }

  await u.po.flagBuilder.expect.attributeSelectionOptions(
    [
      "Country",
      "Email",
      "IP Address",
      "Key",
      "Name",
      "Anonymous",
      "First Name",
      "Last Name",
      ...attributesToAdd,
    ],
    { exact: true },
  )
})
