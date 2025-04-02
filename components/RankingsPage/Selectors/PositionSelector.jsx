"use client"

import { Button } from "@/components/ui/button"
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
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

const positionOptions = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "pg",
        label: "PG",
    },
    {
        value: "sg",
        label: "SG",
    },
    {
        value: "sf",
        label: "SF",
    },
    {
        value: "pf",
        label: "PF",
    },
    {
        value: "c",
        label: "C",
    },
    {
        value: "g",
        label: "G",
    },
    {
        value: "f",
        label: "F",
    },
]

export function PositionSelector({ value, onValueChange, defaultValue = "all" }) {
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
                        ? positionOptions.find((position) => position.value === displayValue)?.label
                        : "Select position..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    {/* <CommandInput placeholder="Search positions..." className="h-9" /> */}
                    <CommandList>
                        <CommandEmpty>No position found.</CommandEmpty>
                        <CommandGroup>
                            {positionOptions.map((position) => (
                                <CommandItem
                                    key={position.value}
                                    value={position.value}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {position.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === position.value ? "opacity-100" : "opacity-0"
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