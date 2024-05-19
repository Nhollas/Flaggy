import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test("Required attribute 'Key' is added by default", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.expect.attributeInFormTableWithValue({
    attribute: "key",
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
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openAttributesDropdown()
  await u.po.flagBuilder.expect.attributeOptionIsDisabled("Key")
})

test("Attributes select has default values", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openAttributesDropdown()
  await u.po.flagBuilder.expect.attributeOptionsAreVisible(
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
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openAttributesDropdown()

  await u.po.flagBuilder.selectAttribute("Email")
  await u.po.flagBuilder.closeAttributesDropdown()
  await u.po.flagBuilder.setAttributeValue({
    attribute: "Email",
    value: "john.doe@gmail.com",
  })

  await u.po.flagBuilder.openAttributesDropdown()
  await u.po.flagBuilder.selectAttribute("Email")
  await u.po.flagBuilder.selectAttribute("Email")
  await u.po.flagBuilder.closeAttributesDropdown()

  await u.po.flagBuilder.expect.attributeInFormTableWithValue({
    attribute: "Email",
    value: "default",
  })
})

test("Attribute values can be edited", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openAttributesDropdown()

  await u.po.flagBuilder.selectAttribute("Email")
  await u.po.flagBuilder.closeAttributesDropdown()

  await u.po.flagBuilder.setAttributeValue({
    attribute: "Email",
    value: "john.doe@gmail.com",
  })
})

test("Previously added custom attributes are retained when dismissing the dialog", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openAttributesDropdown()

  const attributesToAdd = ["Middle Name", "Town", "Age"]

  for (const attribute of attributesToAdd) {
    await u.po.flagBuilder.searchAttribute(attribute)
    await u.po.flagBuilder.clickAddCustomAttribute(attribute)
    await u.po.flagBuilder.expect.attributeOptionIsSelected(attribute)
  }

  await u.po.flagBuilder.expect.attributeOptionsAreVisible(
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
