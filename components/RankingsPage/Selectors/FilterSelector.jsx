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

const filterOptions = [
    {
        value: "all",
        label: "No Filter",
    },
    {
        group: "Schedule Strength",
        options: [
            {
                value: "strong_schedule",
                label: "Strong Schedule",
            },
            {
                value: "medium_schedule",
                label: "Average Schedule",
            },
            {
                value: "weak_schedule",
                label: "Weak Schedule",
            }
        ]
    },
    {
        group: "Game Type",
        options: [
            {
                value: "playoff_games",
                label: "Playoff Games",
            },
            {
                value: "back_to_back",
                label: "Back-to-Back Games"
            },
            {
                value: "rest_3plus",
                label: "3+ Days Rest"
            }
        ]
    },
    {
        group: "Performance",
        options: [
            {
                value: "hot_streak",
                label: "Hot Streak",
            },
            {
                value: "cold_streak",
                label: "Cold Streak"
            }
        ]
    }
]

export function FilterSelector({ value, onValueChange }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? filterOptions.flatMap(group =>
                            'options' in group ? group.options : [group]
                        ).find(option => option.value === value)?.label
                        : "Select filter..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No filter found.</CommandEmpty>
                        <CommandGroup>
                            {filterOptions.map((group, index) => (
                                'options' in group ? (
                                    <React.Fragment key={group.group}>
                                        <CommandItem disabled className="font-semibold text-sm text-muted-foreground">
                                            {group.group}
                                        </CommandItem>
                                        {group.options.map(option => (
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
                                    </React.Fragment>
                                ) : (
                                    <CommandItem
                                        key={group.value}
                                        value={group.value}
                                        onSelect={(currentValue) => {
                                            onValueChange(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {group.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === group.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                )
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 