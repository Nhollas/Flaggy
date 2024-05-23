import test from "@/playwright/fixtures/next-fixture"

test.use({
  permissions: ["clipboard-read", "clipboard-write"],
})

test("Users get their context persisted when they use a generated URL.", async ({
  utils,
}) => {
  await utils.po.flagBuilder.setupSingleContextExample()
  await utils.po.flagBuilder.clickGenerateUrl()
  await utils.po.flagBuilder.goToGeneratedUrl()
  await utils.po.flagBuilder.clickViewContext()

  await utils.po.flagBuilder.expect.attributeInDisplayTableWithValue({
    attribute: "key",
    value: "user-123",
  })
  await utils.po.flagBuilder.expect.attributeInDisplayTableWithValue({
    attribute: "middle name",
    value: "default",
  })

  await utils.page.reload()

  await utils.po.flagBuilder.clickViewContext()
  await utils.po.flagBuilder.expect.attributeInDisplayTableWithValue({
    attribute: "key",
    value: "user-123",
  })
  await utils.po.flagBuilder.expect.attributeInDisplayTableWithValue({
    attribute: "middle name",
    value: "default",
  })
})
