import { expect } from "@playwright/test"
import {
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfDay,
} from "date-fns"

import test from "@/playwright/fixtures/next-fixture"

test("ShadnCn Calendar Component Range Assertion", async ({ page }) => {
  await page.goto("/test")

  /*
    Requirement: Only dates within 30 days should be enabled.
  */
  const fromDate = new Date()
  const toDate = addDays(fromDate, 30)
  const fromMonthDate = startOfMonth(fromDate)
  const toMonthDate = endOfMonth(toDate)

  const daysInMonthRange = eachDayOfInterval({
    start: fromMonthDate,
    end: toMonthDate,
  })

  type Day = {
    number: string
    month: string
    enabled: boolean
  }

  type DaysGroupByMonth = {
    [month: string]: Day[]
  }

  const groupedDaysByMonth: DaysGroupByMonth = daysInMonthRange
    .map((day) => ({
      number: day.getDate().toString(),
      month: day.toLocaleString("en", { month: "long" }),
      enabled:
        startOfDay(day) >= startOfDay(fromDate) &&
        startOfDay(day) <= startOfDay(toDate),
    }))
    .reduce((acc: DaysGroupByMonth, day) => {
      if (!acc[day.month]) {
        acc[day.month] = []
      }

      acc[day.month]!.push(day)

      return acc
    }, {})

  for (const days of Object.values(groupedDaysByMonth)) {
    for (const day of days) {
      const { enabled, number } = day

      await expect(
        page.getByRole("gridcell", { name: number, exact: true }),
      ).toBeEnabled({
        enabled,
      })
    }

    await page.getByRole("button", { name: /next month/i }).click()
  }
})
