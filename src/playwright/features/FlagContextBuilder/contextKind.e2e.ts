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
