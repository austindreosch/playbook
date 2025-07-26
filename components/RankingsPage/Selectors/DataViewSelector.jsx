"use client"

import { Button } from "@/components/alignui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/alignui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

const viewOptions = [
    {
        value: "season",
        label: "Season To Date",
    },
    {
        value: "projections",
        label: "Rest of Season",
    }
]

export function DataViewSelector({ value, onValueChange, defaultValue = "season" }) {
    const [open, setOpen] = React.useState(false)
    const displayValue = value || defaultValue

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {displayValue
                        ? viewOptions.find((option) => option.value === displayValue)?.label
                        : "Select view..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    {/* <CommandInput placeholder="Search views..." className="h-9" /> */}
                    <CommandList>
                        <CommandEmpty>No view found.</CommandEmpty>
                        <CommandGroup>
                            {viewOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 