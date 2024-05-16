import "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { afterAll, afterEach, beforeAll } from "vitest"

global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  };

import { server } from "@/test/server"

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
