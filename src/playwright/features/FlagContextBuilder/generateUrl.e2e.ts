import test from "@/playwright/fixtures/next-fixture"
import { createTestUtils } from "@/playwright/utils"

test.use({
  permissions: ["clipboard-read", "clipboard-write"],
})

test("Users get their context persisted when they use a generated URL.", async ({
  page,
  context,
  browser,
}) => {
  const u = createTestUtils({ page, context, browser })

  await u.po.flagBuilder.setupSingleContextExample()
  await u.po.flagBuilder.generateUrl()
  await u.po.flagBuilder.goToGeneratedUrl()
  await u.po.flagBuilder.viewContext()

  await u.po.flagBuilder.expectAttributeInDetailTableWithValue("key", {
    value: "user-123",
  })
  await u.po.flagBuilder.expectAttributeInDetailTableWithValue("middle name", {
    value: "default",
  })

  await page.reload()

  await u.po.flagBuilder.viewContext()
  await u.po.flagBuilder.expectAttributeInDetailTableWithValue("key", {
    value: "user-123",
  })
  await u.po.flagBuilder.expectAttributeInDetailTableWithValue("middle name", {
    value: "default",
  })
})
