vi.mock("@/app/lib/env")
vi.mock("react", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react")>()
  return {
    ...mod,
    cache: (fn: any) => fn,
  }
})
vi.mock("next/headers")
vi.mock("@launchdarkly/node-server-sdk")

import { init } from "@launchdarkly/node-server-sdk"
import { cookies, draftMode } from "next/headers"
import { expect, vi, MockedFunction, describe, test } from "vitest"

import { render, resolveComponent, screen, waitFor } from "@/test/utils"

import { FeatureFlag } from "../FeatureFlag"

const mockedVariationFn = vi.fn()
const mockedCookiesFn = cookies as MockedFunction<any>
const mockedDraftmodeFn = draftMode as MockedFunction<any>
const mockedLaunchDarklyInitFn = init as MockedFunction<any>

const renderFeatureFlagComponentWithContext = async ({
  cookieValue,
  mockValue,
}: {
  cookieValue: string
  mockValue: boolean
}) => {
  mockedCookiesFn.mockReturnValue({
    get: () => ({ value: cookieValue }),
  })

  mockedDraftmodeFn.mockReturnValue({
    isEnabled: true,
  })

  mockedVariationFn.mockReturnValue(mockValue)
  mockedLaunchDarklyInitFn.mockReturnValue({
    waitForInitialization: async () => {},
    variation: mockedVariationFn,
  })

  const FeatureFlagResolved = await resolveComponent(FeatureFlag, {
    flag: "exampleFlag",
    defaultValue: false,
    render: (val: boolean) => (
      <h1>Feature flag is: {val ? "true" : "false"}</h1>
    ),
  })

  render(<FeatureFlagResolved />)
}

describe("FeatureFlag", () => {
  test("adapts single context to LaunchDarkly's format and renders correctly", async () => {
    await renderFeatureFlagComponentWithContext({
      cookieValue:
        '{"contexts":[{"kind":"purchase","attributes":{"productInstanceId":"1234", "key":"purchase-123"}}]}',
      mockValue: true,
    })

    const expectedContext = {
      kind: "purchase",
      key: "purchase-123",
      productInstanceId: "1234",
    }
    expect(mockedVariationFn).toHaveBeenCalledWith(
      "exampleFlag",
      expectedContext,
      false,
    )

    await waitFor(() => {
      expect(screen.getByText("Feature flag is: true")).toBeInTheDocument()
    })
  })

  test("adapts multi context to LaunchDarkly's format and renders correctly", async () => {
    await renderFeatureFlagComponentWithContext({
      cookieValue:
        '{"contexts":[{"kind":"purchase","attributes":{"productInstanceId":"1234", "key":"purchase-123"}},{"kind":"user","attributes":{"email":"test@test.com","phone":"1234567890","key":"user-123"}}]}',
      mockValue: true,
    })

    const expectedContext = {
      kind: "multi",
      purchase: {
        key: "purchase-123",
        productInstanceId: "1234",
      },
      user: {
        key: "user-123",
        email: "test@test.com",
        phone: "1234567890",
      },
    }
    expect(mockedVariationFn).toHaveBeenCalledWith(
      "exampleFlag",
      expectedContext,
      false,
    )

    await waitFor(() => {
      expect(screen.getByText("Feature flag is: true")).toBeInTheDocument()
    })
  })

  test("adapts no context to LaunchDarkly's format and renders correctly", async () => {
    await renderFeatureFlagComponentWithContext({
      cookieValue: '{"contexts":[]}',
      mockValue: false,
    })

    const expectedContext = {
      kind: "user",
      key: "anonymous",
      anonymous: true,
    }
    expect(mockedVariationFn).toHaveBeenCalledWith(
      "exampleFlag",
      expectedContext,
      false,
    )

    await waitFor(() => {
      expect(screen.getByText("Feature flag is: false")).toBeInTheDocument()
    })
  })

  test("When user has invalid context they are set with anonymous context and evaluate", async () => {
    await renderFeatureFlagComponentWithContext({
      cookieValue: "invalid",
      mockValue: false,
    })

    const expectedContext = {
      kind: "user",
      key: "anonymous",
      anonymous: true,
    }
    expect(mockedVariationFn).toHaveBeenCalledWith(
      "exampleFlag",
      expectedContext,
      false,
    )

    await waitFor(() => {
      expect(screen.getByText("Feature flag is: false")).toBeInTheDocument()
    })
  })
})
