import { Browser, BrowserContext, Page } from "@playwright/test"

import { createFlagBuilderComponentPageObject } from "./pageObjects/flagBuilderPageObject"

export const buildLocalUrl = (port: string, path: string = "") =>
  `http://localhost:${port}${path}`

type TestUtilsArgs = {
  page: Page
  context: BrowserContext
  browser: Browser
}

export const createTestUtils = (params: TestUtilsArgs) => {
  const pageObjects = {
    flagBuilder: createFlagBuilderComponentPageObject(params),
  }

  return {
    po: pageObjects,
  }
}
