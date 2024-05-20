import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test("Context kind can be changed", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openContextKindDropdown()

  await u.po.flagBuilder.expect.contextKindIsSelected("user")
  await u.po.flagBuilder.searchContextKind("purchase")
  await u.po.flagBuilder.clickAddCustomContextKind("purchase")

  await u.po.flagBuilder.closeContextKindDropdown()

  await u.po.flagBuilder.openContextKindDropdown()
  await u.po.flagBuilder.expect.contextKindIsUnselected("user")
  await u.po.flagBuilder.expect.contextKindIsSelected("purchase")
})

test("Importing context with custom contextKinds populates contextKind selection", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  const url = `http://localhost:3000/api/flag/context?data={"contexts":[{"kind":"basket","attributes":{"key":"user-123"}}]}&redirectUrl=http://localhost:3000/`

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.pastePreloadedState(url)

  await u.po.flagBuilder.openContextKindDropdown()
  await u.po.flagBuilder.expect.contextKindOptionsAreVisible(
    ["user", "basket"],
    { exact: true },
  )

  await u.po.flagBuilder.expect.contextKindIsSelected("basket")
})

test("Context kind display names are lower cased", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openContextKindDropdown()

  await u.po.flagBuilder.searchContextKind(
    "Context kind ThaT is nOt Lower Cased",
  )
  await u.po.flagBuilder.clickAddCustomContextKind(
    "Context kind ThaT is nOt Lower Cased",
  )

  await u.po.flagBuilder.expect.contextKindIsSelected(
    "context kind that is not lower cased",
  )
})

test("Previously added custom context kinds are retained when dismissing the dialog", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openContextKindDropdown()
  await u.po.flagBuilder.expect.contextKindIsSelected("user")

  const customContextKindsToAdd = ["purchase", "customer", "basket"]

  for (const kind of customContextKindsToAdd) {
    await u.po.flagBuilder.searchContextKind(kind)
    await u.po.flagBuilder.clickAddCustomContextKind(kind)
    await u.po.flagBuilder.expect.contextKindIsSelected(kind)
  }

  await u.po.flagBuilder.closeContextKindDropdown()
  await u.po.flagBuilder.openContextKindDropdown()

  await u.po.flagBuilder.expect.contextKindOptionsAreVisible(
    ["user", ...customContextKindsToAdd],
    { exact: true },
  )
  await u.po.flagBuilder.expect.contextKindIsSelected("basket")
})
