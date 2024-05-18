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
  await u.po.flagBuilder.expectAttributeInTableWithValue("key", {
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
  const attribute = await u.po.flagBuilder.expectAttributeOptionIsVisible("Key")
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
  await u.po.flagBuilder.expectAttributeOptionsAreVisible(
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

test("Previously added attributes don't keep their value when re-selected", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  const closeAttrSelection = await u.po.flagBuilder.openAttributesSelection()

  await u.po.flagBuilder.selectAttribute("Email")
  await closeAttrSelection()
  await u.po.flagBuilder.editAttribute("Email", "john.doe@gmail.com")

  await u.po.flagBuilder.openAttributesSelection()
  await u.po.flagBuilder.selectAttribute("Email")
  await u.po.flagBuilder.selectAttribute("Email")
  await closeAttrSelection()

  await u.po.flagBuilder.expectAttributeInTableWithValue("Email", {
    value: "default",
  })
})

test("Attribute values can be edited", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  const closeAttrSelection = await u.po.flagBuilder.openAttributesSelection()

  await u.po.flagBuilder.selectAttribute("Email")

  await closeAttrSelection()

  await u.po.flagBuilder.editAttribute("Email", "john.doe@gmail.com")
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
    await u.po.flagBuilder.expectAttributeOptionIsSelected(attribute)
  }

  await u.po.flagBuilder.expectAttributeOptionsAreVisible(
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
