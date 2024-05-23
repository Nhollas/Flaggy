import { Page } from "@playwright/test"

import { createFlagBuilderComponentPageObject } from "./pageObjects/flagBuilder"

export const buildLocalUrl = (port: string, path: string = "") =>
  `http://localhost:${port}${path}`

type TestUtilsArgs = {
  page: Page
}

export const createTestUtils = (params: TestUtilsArgs) => {
  const { page } = params
  const pageObjects = {
    flagBuilder: createFlagBuilderComponentPageObject(params),
  }

  return {
    po: pageObjects,
    page,
  }
}
