import test from "@/playwright/fixtures/next-fixture"

test("Context kind can be changed", async ({ po: { flagBuilderPage } }) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openContextKindDropdown()

  await flagBuilderPage.expect.contextKindIsSelected("user")
  await flagBuilderPage.searchContextKind("purchase")
  await flagBuilderPage.clickAddCustomContextKind("purchase")

  await flagBuilderPage.closeContextKindDropdown()

  await flagBuilderPage.openContextKindDropdown()
  await flagBuilderPage.expect.contextKindIsUnselected("user")
  await flagBuilderPage.expect.contextKindIsSelected("purchase")
})

test("Importing context with custom contextKinds populates contextKind selection", async ({
  po: { flagBuilderPage },
}) => {
  const singleContextWithCustomContextKind = `http://localhost:3000/api/flag/context?data={"contexts":[{"kind":"basket","attributes":{"key":"user-123"}}]}&redirectUrl=http://localhost:3000/`

  await flagBuilderPage.goTo()
  await flagBuilderPage.pastePreloadedState(singleContextWithCustomContextKind)

  await flagBuilderPage.openContextKindDropdown()
  await flagBuilderPage.expect.contextKindOptionsAreVisible(
    ["user", "basket"],
    { exact: true },
  )

  await flagBuilderPage.expect.contextKindIsSelected("basket")
})

test("Context kind display names are lower cased", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openContextKindDropdown()

  await flagBuilderPage.searchContextKind(
    "Context kind ThaT is nOt Lower Cased",
  )
  await flagBuilderPage.clickAddCustomContextKind(
    "Context kind ThaT is nOt Lower Cased",
  )

  await flagBuilderPage.expect.contextKindIsSelected(
    "context kind that is not lower cased",
  )
})

test("Previously added custom context kinds are retained when dismissing the dialog", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.goTo()
  await flagBuilderPage.clickAddContext()
  await flagBuilderPage.openContextKindDropdown()
  await flagBuilderPage.expect.contextKindIsSelected("user")

  const customContextKindsToAdd = ["purchase", "customer", "basket"]

  for (const kind of customContextKindsToAdd) {
    await flagBuilderPage.searchContextKind(kind)
    await flagBuilderPage.clickAddCustomContextKind(kind)
    await flagBuilderPage.expect.contextKindIsSelected(kind)
  }

  await flagBuilderPage.closeContextKindDropdown()
  await flagBuilderPage.openContextKindDropdown()

  await flagBuilderPage.expect.contextKindOptionsAreVisible(
    ["user", ...customContextKindsToAdd],
    { exact: true },
  )
  await flagBuilderPage.expect.contextKindIsSelected("basket")
})
