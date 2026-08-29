// src/components/global-filter-bar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface GlobalFilterBarProps {
  showSearch?: boolean;
  showDateRange?: boolean;

  searchVal?: string;
  dateRangeVal?: DateRange | undefined;
  searchPlaceholder?: string;
  dateRangeLabel?: string;

  onSearchChange?: (val: string) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function GlobalFilterBar({
  showSearch = false,
  showDateRange = false,

  searchVal = "",
  dateRangeVal,
  searchPlaceholder = "Search...",
  dateRangeLabel = "Pick a date range",

  onSearchChange,
  onDateRangeChange,
}: GlobalFilterBarProps) {
  if (!showSearch && !showDateRange) return null;

  return (
    <div className="bg-card mb-6 flex flex-col gap-4 rounded-xl border p-5 shadow-sm md:flex-row md:items-center">
      {showSearch ? (
        <div className="relative w-full md:max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9"
            value={searchVal}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      ) : null}

      {showDateRange ? (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal md:w-64",
                  !dateRangeVal && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="size-4" />
                {dateRangeVal?.from ? (
                  dateRangeVal.to ? (
                    <>
                      {format(dateRangeVal.from, "LLL dd, y")} – {format(dateRangeVal.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRangeVal.from, "LLL dd, y")
                  )
                ) : (
                  <span>{dateRangeLabel}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRangeVal?.from}
                selected={dateRangeVal}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {dateRangeVal?.from ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-9"
              onClick={() => onDateRangeChange?.(undefined)}
            >
              <X className="size-4" />
              <span className="sr-only">Clear date range</span>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}