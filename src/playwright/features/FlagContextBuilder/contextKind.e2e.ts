import test from "@/playwright/fixtures/next-fixture"

test("Context kind can be changed", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openContextKindDropdown()

  await utils.po.flagBuilder.expect.contextKindIsSelected("user")
  await utils.po.flagBuilder.searchContextKind("purchase")
  await utils.po.flagBuilder.clickAddCustomContextKind("purchase")

  await utils.po.flagBuilder.closeContextKindDropdown()

  await utils.po.flagBuilder.openContextKindDropdown()
  await utils.po.flagBuilder.expect.contextKindIsUnselected("user")
  await utils.po.flagBuilder.expect.contextKindIsSelected("purchase")
})

test("Importing context with custom contextKinds populates contextKind selection", async ({
  utils,
}) => {
  const url = `http://localhost:3000/api/flag/context?data={"contexts":[{"kind":"basket","attributes":{"key":"user-123"}}]}&redirectUrl=http://localhost:3000/`

  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.pastePreloadedState(url)

  await utils.po.flagBuilder.openContextKindDropdown()
  await utils.po.flagBuilder.expect.contextKindOptionsAreVisible(
    ["user", "basket"],
    { exact: true },
  )

  await utils.po.flagBuilder.expect.contextKindIsSelected("basket")
})

test("Context kind display names are lower cased", async ({ utils }) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openContextKindDropdown()

  await utils.po.flagBuilder.searchContextKind(
    "Context kind ThaT is nOt Lower Cased",
  )
  await utils.po.flagBuilder.clickAddCustomContextKind(
    "Context kind ThaT is nOt Lower Cased",
  )

  await utils.po.flagBuilder.expect.contextKindIsSelected(
    "context kind that is not lower cased",
  )
})

test("Previously added custom context kinds are retained when dismissing the dialog", async ({
  utils,
}) => {
  await utils.po.flagBuilder.goTo()
  await utils.po.flagBuilder.clickAddContext()
  await utils.po.flagBuilder.openContextKindDropdown()
  await utils.po.flagBuilder.expect.contextKindIsSelected("user")

  const customContextKindsToAdd = ["purchase", "customer", "basket"]

  for (const kind of customContextKindsToAdd) {
    await utils.po.flagBuilder.searchContextKind(kind)
    await utils.po.flagBuilder.clickAddCustomContextKind(kind)
    await utils.po.flagBuilder.expect.contextKindIsSelected(kind)
  }

  await utils.po.flagBuilder.closeContextKindDropdown()
  await utils.po.flagBuilder.openContextKindDropdown()

  await utils.po.flagBuilder.expect.contextKindOptionsAreVisible(
    ["user", ...customContextKindsToAdd],
    { exact: true },
  )
  await utils.po.flagBuilder.expect.contextKindIsSelected("basket")
})
