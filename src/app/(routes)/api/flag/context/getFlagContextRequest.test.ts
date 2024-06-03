vi.mock("@/app/lib/env.ts")
vi.mock("next/headers")
vi.mock("react", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react")>()
  return {
    ...mod,
    cache: (fn: any) => fn,
  }
})
vi.useFakeTimers()

import { cookies, draftMode } from "next/headers"
import { describe, it, expect, beforeEach, vi, MockedFunction } from "vitest"

import modelFactory from "@/test/model-factory"

import { GET } from "./route"

const buildStringUrlWithDataQuery = (data: string, redirectUrl: string) => {
  const url = new URL("http://localhost")
  url.searchParams.set("data", data)
  url.searchParams.set("redirectUrl", redirectUrl)
  return url.toString()
}

const mockedCookies = cookies as MockedFunction<any>
const mockedDraftmodeFn = draftMode as MockedFunction<any>

describe("When Request Body is Valid", () => {
  const mockSetCookies = vi.fn()
  let response: Response

  beforeEach(async () => {
    const mockedRequest = modelFactory.request({
      url: buildStringUrlWithDataQuery(
        '{"contexts":[{"kind":"user","attributes":{"email":"user-123@gmail.com","phone":"1234567890","key":"user-123"}}]}',
        "http://localhost/redirect",
      ),
    })

    mockSetCookies.mockClear()

    mockedCookies.mockReturnValue({
      set: mockSetCookies,
    })

    mockedDraftmodeFn.mockReturnValue({
      enable: () => {},
    })

    vi.setSystemTime(new Date("2024-04-20T13:00:00"))

    response = await GET(mockedRequest)
  })

  it("should return 302Found", () => {
    expect(response.status).toBe(302)
  })

  it("should return a cookie with the feature context value", () => {
    const oneHourForward = "2024-04-20T14:00:00.00"
    const expectedCookiesValue =
      '{"contexts":[{"kind":"user","attributes":{"key":"user-123","email":"user-123@gmail.com","phone":"1234567890"}}]}'

    expect(mockSetCookies).toHaveBeenCalledWith(
      "featureContext",
      expectedCookiesValue,
      {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.parse(oneHourForward)),
      },
    )
  })

  it("should redirect to the url provided", async () => {
    expect(response.headers.get("location")).toBe("http://localhost/redirect")
  })
})
