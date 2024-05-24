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

  await utils.po.flagBuilder.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })
  await utils.po.flagBuilder.expect.itemInDisplayTableWithValue({
    item: "middle name",
    value: "default",
  })

  await utils.page.reload()

  await utils.po.flagBuilder.clickViewContext()
  await utils.po.flagBuilder.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })
  await utils.po.flagBuilder.expect.itemInDisplayTableWithValue({
    item: "middle name",
    value: "default",
  })
})

test("Users can clear their context when they use a generated URL.", async ({
  utils,
  page,
  baseURL,
}) => {
  const singleContextWithCustomContextKind = `/api/flag/context?data={"contexts":[{"kind":"basket","attributes":{"key":"user-123"}}]}&redirectUrl=${baseURL}/`

  await page.goto(singleContextWithCustomContextKind)
  await utils.po.flagBuilder.clickViewContext()
  await utils.po.flagBuilder.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })

  await utils.po.flagBuilder.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })

  await utils.po.flagBuilder.expect.contextKindInDisplayTable("basket")

  await utils.po.flagBuilder.clickClearContext()

  await utils.po.flagBuilder.expect.viewContextButtonIsHidden()
  await utils.po.flagBuilder.expect.displayTableIsHidden()
})
