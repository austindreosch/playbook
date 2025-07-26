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

const sourceOptions = [
    {
        value: "experts",
        label: "Experts (Dynasty)",
    },
    {
        value: "basic",
        label: "Basic (Dynasty)",
    },
]

export function SourceSelector({ value, onValueChange, disabled = false, defaultValue = "experts" }) {
    const [open, setOpen] = React.useState(false)
    const displayValue = value || defaultValue

    return (
        <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between",
                        disabled && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {displayValue
                        ? sourceOptions.find((source) => source.value === displayValue)?.label
                        : "Select source..."}
                    <ChevronsUpDown className={cn(
                        "ml-2 h-4 w-4 shrink-0 opacity-50",
                        disabled && "hidden"
                    )} />
                </Button>
            </PopoverTrigger>
            {!disabled && (
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandList>
                            <CommandEmpty>No source found.</CommandEmpty>
                            <CommandGroup>
                                {sourceOptions.map((source) => (
                                    <CommandItem
                                        key={source.value}
                                        value={source.value}
                                        onSelect={(currentValue) => {
                                            onValueChange(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {source.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === source.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    )
} 