import test from "@/playwright/fixtures/next-fixture"

test.use({
  permissions: ["clipboard-read", "clipboard-write"],
})

test("Importing context with custom attributes populates attribute selection", async ({
  po: { flagBuilderPage },
}) => {
  const singleContextWithCustomAttribute = `http://localhost:3000/api/flag/context?data={"contexts":[{"kind":"user","attributes":{"key":"user-123","custom":"customValue"}}]}&redirectUrl=http://localhost:3000/`

  await flagBuilderPage.goTo()
  await flagBuilderPage.pastePreloadedState(singleContextWithCustomAttribute)

  await flagBuilderPage.openAttributesDropdown()
  await flagBuilderPage.expect.attributeOptionsAreVisible(
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

  await flagBuilderPage.expect.attributeInFormTableWithValue({
    attribute: "Custom",
    value: "customValue",
  })
})

test("Attribute display names are title cased", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openAttributesDropdown()

  await flagBuilderPage.searchAttribute(
    "custom attribute that is not title cased",
  )
  await flagBuilderPage.clickAddCustomAttribute(
    "custom attribute that is not title cased",
  )

  await flagBuilderPage.expect.attributeOptionsAreVisible(
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
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.expect.attributeInFormTableWithValue({
    attribute: "key",
    value: "user-123",
  })
})

test("Required attribute 'Key' cannot be removed", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openAttributesDropdown()
  await flagBuilderPage.expect.attributeOptionIsDisabled("Key")
})

test("Attributes select has default values", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openAttributesDropdown()
  await flagBuilderPage.expect.attributeOptionsAreVisible(
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
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openAttributesDropdown()

  await flagBuilderPage.selectAttribute("Email")
  await flagBuilderPage.closeAttributesDropdown()
  await flagBuilderPage.setAttributeValue({
    attribute: "Email",
    value: "john.doe@gmail.com",
  })

  await flagBuilderPage.openAttributesDropdown()
  await flagBuilderPage.selectAttribute("Email")
  await flagBuilderPage.selectAttribute("Email")
  await flagBuilderPage.closeAttributesDropdown()

  await flagBuilderPage.expect.attributeInFormTableWithValue({
    attribute: "Email",
    value: "default",
  })
})

test("Attribute values can be edited", async ({ po: { flagBuilderPage } }) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openAttributesDropdown()

  await flagBuilderPage.selectAttribute("Email")
  await flagBuilderPage.closeAttributesDropdown()

  await flagBuilderPage.setAttributeValue({
    attribute: "Email",
    value: "john.doe@gmail.com",
  })
})

test("Previously added custom attributes are retained when dismissing the dialog", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openAttributesDropdown()

  const attributesToAdd = ["Middle Name", "Town", "Age"]

  for (const attribute of attributesToAdd) {
    await flagBuilderPage.searchAttribute(attribute)
    await flagBuilderPage.clickAddCustomAttribute(attribute)
    await flagBuilderPage.expect.attributeOptionIsSelected(attribute)
  }

  await flagBuilderPage.expect.attributeOptionsAreVisible(
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
