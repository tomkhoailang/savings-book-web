"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePicker } from "@nextui-org/react"
import MonthPicker from "./MonthPicker"

export function DatePickerCustom({ date, setDate, type = "normal" }: { date: any; setDate: any; type?: string }) {
  const [open, setOpen] = React.useState(false)
  console.log(type);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="" align="start">
        {type === "normal" ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              setOpen(false)
            }}
            initialFocus
          />
        ) : (
          <MonthPicker currentMonth={date} onMonthChange={(value) => setDate(value)} />
        )}
      </PopoverContent>
    </Popover>
  )
}
