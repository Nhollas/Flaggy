"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import * as React from "react"
import { DayPicker, DropdownProps } from "react-day-picker"

import { cn } from "@/app/lib/utils"

import { buttonVariants } from "./button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomDropdown({ value, onChange, children }: DropdownProps) {
  const options = React.Children.toArray(children) as OptionElement[]

  const handleChange = (value: string) => {
    const changeEvent = {
      target: {
        value,
      },
    } as React.ChangeEvent<HTMLSelectElement>
    onChange?.(changeEvent)
  }

  return (
    <Select value={value?.toString()} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, childIdx: number) => (
          <SelectItem
            key={`${option.props.value}-${childIdx}`}
            value={option.props.value?.toString() ?? ""}
          >
            {option.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const Calendar = ({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center relative items-center",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "size-8 relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        caption_dropdowns: "flex flex-row gap-x-2 w-full",

        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="size-4" />,
        IconRight: () => <ChevronRightIcon className="size-4" />,
        Dropdown: CustomDropdown,
        CaptionLabel: () => null,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

type OptionProps = React.HTMLProps<HTMLOptionElement>
type OptionElement = React.ReactElement<OptionProps>

export { Calendar }
