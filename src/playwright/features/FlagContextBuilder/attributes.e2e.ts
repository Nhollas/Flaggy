import test from "@/playwright/fixtures/next-fixture"

test.use({
  permissions: ["clipboard-read", "clipboard-write"],
})

test("Importing context with custom attributes populates attribute selection", async ({
  utils,
}) => {
  const singleContextWithCustomAttribute = `http://localhost:3000/api/flag/context?data={"contexts":[{"kind":"user","attributes":{"key":"user-123","custom":"customValue"}}]}&redirectUrl=http://localhost:3000/`

  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.pastePreloadedState(
    singleContextWithCustomAttribute,
  )

  await utils.po.flagBuilder.openAttributesDropdown()
  await utils.po.flagBuilder.expect.attributeOptionsAreVisible(
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

  await utils.po.flagBuilder.expect.attributeInFormTableWithValue({
    attribute: "Custom",
    value: "customValue",
  })
})

test("Attribute display names are title cased", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openAttributesDropdown()

  await utils.po.flagBuilder.searchAttribute(
    "custom attribute that is not title cased",
  )
  await utils.po.flagBuilder.clickAddCustomAttribute(
    "custom attribute that is not title cased",
  )

  await utils.po.flagBuilder.expect.attributeOptionsAreVisible(
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

test("Required attribute 'Key' is added by default", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.expect.attributeInFormTableWithValue({
    attribute: "key",
    value: "user-123",
  })
})

test("Required attribute 'Key' cannot be removed", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openAttributesDropdown()
  await utils.po.flagBuilder.expect.attributeOptionIsDisabled("Key")
})

test("Attributes select has default values", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openAttributesDropdown()
  await utils.po.flagBuilder.expect.attributeOptionsAreVisible(
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
  utils,
}) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openAttributesDropdown()

  await utils.po.flagBuilder.selectAttribute("Email")
  await utils.po.flagBuilder.closeAttributesDropdown()
  await utils.po.flagBuilder.setAttributeValue({
    attribute: "Email",
    value: "john.doe@gmail.com",
  })

  await utils.po.flagBuilder.openAttributesDropdown()
  await utils.po.flagBuilder.selectAttribute("Email")
  await utils.po.flagBuilder.selectAttribute("Email")
  await utils.po.flagBuilder.closeAttributesDropdown()

  await utils.po.flagBuilder.expect.attributeInFormTableWithValue({
    attribute: "Email",
    value: "default",
  })
})

test("Attribute values can be edited", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openAttributesDropdown()

  await utils.po.flagBuilder.selectAttribute("Email")
  await utils.po.flagBuilder.closeAttributesDropdown()

  await utils.po.flagBuilder.setAttributeValue({
    attribute: "Email",
    value: "john.doe@gmail.com",
  })
})

test("Previously added custom attributes are retained when dismissing the dialog", async ({
  utils,
}) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openAttributesDropdown()

  const attributesToAdd = ["Middle Name", "Town", "Age"]

  for (const attribute of attributesToAdd) {
    await utils.po.flagBuilder.searchAttribute(attribute)
    await utils.po.flagBuilder.clickAddCustomAttribute(attribute)
    await utils.po.flagBuilder.expect.attributeOptionIsSelected(attribute)
  }

  await utils.po.flagBuilder.expect.attributeOptionsAreVisible(
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
