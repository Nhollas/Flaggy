import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test("Context kind can be changed", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.clickAddContext()
  await u.po.flagBuilder.openContextKindDropdown()

  await u.po.flagBuilder.expect.contextKindIsSelected("User")
  await u.po.flagBuilder.searchContextKind("Purchase")
  await u.po.flagBuilder.clickAddCustomContextKind("Purchase")

  await u.po.flagBuilder.closeContextKindDropdown()

  await u.po.flagBuilder.openContextKindDropdown()
  await u.po.flagBuilder.expect.contextKindIsUnselected("User")
  await u.po.flagBuilder.expect.contextKindIsSelected("Purchase")
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
  await u.po.flagBuilder.expect.contextKindIsSelected("User")

  const customContextKindsToAdd = ["Purchase", "Customer", "Basket"]

  for (const kind of customContextKindsToAdd) {
    await u.po.flagBuilder.searchContextKind(kind)
    await u.po.flagBuilder.clickAddCustomContextKind(kind)
    await u.po.flagBuilder.expect.contextKindIsSelected(kind)
  }

  await u.po.flagBuilder.closeContextKindDropdown()
  await u.po.flagBuilder.openContextKindDropdown()

  await u.po.flagBuilder.expect.contextKindOptionsAreVisible(
    ["User", ...customContextKindsToAdd],
    { exact: true },
  )
  await u.po.flagBuilder.expect.contextKindIsSelected("Basket")
})
