import test from "@/playwright/fixtures/next-fixture"

test.use({
  permissions: ["clipboard-read", "clipboard-write"],
})

test("Users get their context persisted when they use a generated URL.", async ({
  po: { flagBuilderPage },
}) => {
  await flagBuilderPage.setupSingleContextExample()
  await flagBuilderPage.clickGenerateUrl()
  await flagBuilderPage.goToGeneratedUrl()
  await flagBuilderPage.clickViewContext()

  await flagBuilderPage.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })
  await flagBuilderPage.expect.itemInDisplayTableWithValue({
    item: "middle name",
    value: "default",
  })

  await flagBuilderPage.reload()

  await flagBuilderPage.clickViewContext()
  await flagBuilderPage.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })
  await flagBuilderPage.expect.itemInDisplayTableWithValue({
    item: "middle name",
    value: "default",
  })
})

test("Users can clear their context when they use a generated URL.", async ({
  po: { flagBuilderPage },
  page,
  baseURL,
}) => {
  const singleContextWithCustomContextKind = `/api/flag/context?data={"contexts":[{"kind":"basket","attributes":{"key":"user-123"}}]}&redirectUrl=${baseURL}/`

  await page.goto(singleContextWithCustomContextKind)
  await flagBuilderPage.clickViewContext()
  await flagBuilderPage.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })

  await flagBuilderPage.expect.itemInDisplayTableWithValue({
    item: "key",
    value: "user-123",
  })

  await flagBuilderPage.expect.contextKindInDisplayTable("basket")

  await flagBuilderPage.clickClearContext()

  await flagBuilderPage.expect.viewContextButtonIsHidden()
  await flagBuilderPage.expect.displayTableIsHidden()
})
