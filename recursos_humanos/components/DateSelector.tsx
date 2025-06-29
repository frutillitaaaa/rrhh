"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DateSelectorProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
};


export function DateSelector({label, value, onChange}: DateSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const parsedDate = value ? new Date(value) : undefined

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {parsedDate ? parsedDate.toLocaleDateString() : "Seleccionar fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              if(date) {
                const isoString = date?.toISOString().split("T")[0];
                onChange(isoString);
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
