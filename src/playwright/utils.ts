import { Page } from "@playwright/test"

import { createFlagBuilderPageObject } from "./pageObjects/flagBuilder"

export const buildLocalUrl = (port: string, path: string = "") =>
  `http://localhost:${port}${path}`

type TestUtilsArgs = {
  page: Page
}

export const createTestUtils = (params: TestUtilsArgs) => {
  const pageObjects = {
    flagBuilderPage: createFlagBuilderPageObject(params),
  }

  return {
    po: pageObjects,
  }
}
