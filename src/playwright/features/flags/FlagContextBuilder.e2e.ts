import { createTestUtils } from "@/playwright/utils"

import test from "../../fixtures/next-fixture"

test("Context kind can be changed", async ({ page, context, browser }) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  const closeCKindSelection = await u.po.flagBuilder.openContextKindSelection()

  await u.po.flagBuilder.expect.contextKindSelected("User")
  await u.po.flagBuilder.searchAndSetContextKind("Purchase")

  await closeCKindSelection()

  await u.po.flagBuilder.openContextKindSelection()
  await u.po.flagBuilder.expect.contextKindUnselected("User")
  await u.po.flagBuilder.expect.contextKindSelected("Purchase")
})

test("Previously added context kinds are retained on edit", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.goTo()
  await u.po.flagBuilder.addContext()
  const closeCKindSelection = await u.po.flagBuilder.openContextKindSelection()
  await u.po.flagBuilder.expect.contextKindSelected("User")

  await u.po.flagBuilder.searchAndSetContextKind("Purchase")
  await u.po.flagBuilder.searchAndSetContextKind("Customer")
  await u.po.flagBuilder.searchAndSetContextKind("Basket")

  await closeCKindSelection()
  await u.po.flagBuilder.openContextKindSelection()

  await u.po.flagBuilder.expect.contextKindOption("Purchase")
  await u.po.flagBuilder.expect.contextKindOption("Customer")
  await u.po.flagBuilder.expect.contextKindOption("Basket")
  await u.po.flagBuilder.expect.contextKindSelected("Basket")
})
