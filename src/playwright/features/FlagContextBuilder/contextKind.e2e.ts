import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test("Context kind can be changed", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  const closeCKindSelection = await u.po.flagBuilder.openContextKindSelection()

  await u.po.flagBuilder.expectContextKindIsSelected("User")
  await u.po.flagBuilder.searchAndSetContextKind("Purchase")

  await closeCKindSelection()

  await u.po.flagBuilder.openContextKindSelection()
  await u.po.flagBuilder.expectContextKindIsUnselected("User")
  await u.po.flagBuilder.expectContextKindIsSelected("Purchase")
})

test("Previously added custom context kinds are retained when dismissing the dialog", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  const closeCKindSelection = await u.po.flagBuilder.openContextKindSelection()
  await u.po.flagBuilder.expectContextKindIsSelected("User")

  await u.po.flagBuilder.searchAndSetContextKind("Purchase")
  await u.po.flagBuilder.searchAndSetContextKind("Customer")
  await u.po.flagBuilder.searchAndSetContextKind("Basket")

  await closeCKindSelection()
  await u.po.flagBuilder.openContextKindSelection()

  await u.po.flagBuilder.expectContextKindOptionsAreVisible(
    ["User", "Purchase", "Customer", "Basket"],
    { exact: true },
  )
  await u.po.flagBuilder.expectContextKindIsSelected("Basket")
})
