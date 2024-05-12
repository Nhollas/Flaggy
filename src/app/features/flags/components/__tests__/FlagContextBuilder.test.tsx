vi.mock("@/app/lib/env")

import { expect, vi, describe, test } from "vitest"

import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/utils"

import { FlagContextBuilder } from "../FlagContextBuilder"

describe("FlagContextBuilder", () => {
  test("You can click add context and fill out context info", async () => {
    renderWithProviders(<FlagContextBuilder />)

    await waitFor(() => {
      expect(screen.getByText("Flag Context Builder")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: "Add Context" }))

    expect(screen.getByLabelText("Context Kind")).toBeInTheDocument()

    // fireEvent.click(screen.getByLabelText("Attributes"))

    // expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
