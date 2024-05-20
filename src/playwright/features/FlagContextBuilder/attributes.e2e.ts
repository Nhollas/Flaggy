import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test.use({
  permissions: ["clipboard-read", "clipboard-write"],
})

test("Importing context with custom attributes populates attribute selection", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  const url = `http://localhost:3000/api/flag/context?data={"contexts":[{"kind":"user","attributes":{"key":"user-123","custom":"customValue"}}]}&redirectUrl=http://localhost:3000/`

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.pastePreloadedState(url)

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
      "Custom",
    ],
    { exact: true },
  )

  await u.po.flagBuilder.expect.attributeInFormTableWithValue({
    attribute: "Custom",
    value: "customValue",
  })
})

test("Attribute display names are title cased", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openAttributesDropdown()

  await u.po.flagBuilder.searchAttribute(
    "custom attribute that is not title cased",
  )
  await u.po.flagBuilder.clickAddCustomAttribute(
    "custom attribute that is not title cased",
  )

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
      "Custom Attribute That Is Not Title Cased",
    ],
    { exact: true },
  )
})

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
