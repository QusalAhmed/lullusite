"use client"

import React from "react"
import { ChevronDownIcon, SlidersHorizontal } from "lucide-react"
import { type DateRange, TZDate } from "react-day-picker"

// ShadCN
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

// Actions
import getDashboard from "@/actions/dashboard/get"

// Tanstack Query
import { useQuery } from "@tanstack/react-query"

// Local
import DataPage from "./data"
import OrderChart from "./order-chart"
import OrderItem from "./order-item"

// User
import { authClient } from "@/lib/auth-client"

export default function DashboardPage() {
    const [range, setRange] = React.useState<DateRange | undefined>(undefined)
    console.log(range)
    const {data, isLoading, error, isRefetching} = useQuery({
        queryKey: ['dashboard-data', range],
        queryFn: () => getDashboard({from: range?.from?.toISOString(), to: range?.to?.toISOString()}),
        gcTime: 60 * 60 * 1000, // 1 hour
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
    console.log(data)
    const {
        data: session,
        isPending: isSessionPending, //loading state
        error: sessionError, //error object
    } = authClient.useSession()

    return (
        <section>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center mb-8">
                <h1 className="scroll-m-20 text-2xl md:text-4xl font-semibold tracking-tight text-balance flex items-center">
                    {sessionError && <span className="text-red-600">Error loading session</span>}
                    Hi,{' '}
                    {isSessionPending ? (
                        <Skeleton className="h-8 w-32 ml-2"/>
                    ) : session?.user?.name ? (
                        <span className="ml-2">{session.user.name} !</span>
                    ) : (
                        <span className="ml-2">there!</span>
                    )}
                </h1>
                <div className='flex flex-nowrap gap-2 items-center mt-4'>
                    <div className="flex gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="dates"
                                    size="sm"
                                    className="w-56 justify-between font-normal"
                                >
                                    {range?.from && range?.to
                                        ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                                        : "Select custom"}
                                    <ChevronDownIcon/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="center">
                                <Calendar
                                    mode="range"
                                    selected={range}
                                    captionLayout="dropdown"
                                    numberOfMonths={2}
                                    endMonth={new Date()}
                                    disabled={{after: new Date()}}
                                    showWeekNumber
                                    onSelect={(range) => {
                                        // range?.to?.setHours(23, 59, 59, 999)
                                        setRange(range)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setRange(undefined)
                        }}
                    >
                        Clear
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <SlidersHorizontal/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-2">
                            <DropdownMenuItem
                                onClick={() => {
                                    const today = new TZDate()
                                    today.setHours(23, 59, 59, 999)
                                    const from = new TZDate()
                                    from.setHours(0, 0, 0, 0)
                                    setRange({from, to: today})
                                }}
                            >
                                Today
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const yesterday = new TZDate()
                                    yesterday.setDate(yesterday.getDate() - 1)
                                    yesterday.setHours(23, 59, 59, 999)
                                    const from = new TZDate()
                                    from.setDate(from.getDate() - 1)
                                    from.setHours(0, 0, 0, 0)
                                    setRange({from, to: yesterday})
                                }}
                            >
                                Yesterday
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const thisWeekStart = new TZDate()
                                    const day = thisWeekStart.getDay()
                                    const diff = thisWeekStart.getDate() - day + (day === 0 ? -6 : 1)
                                    thisWeekStart.setDate(diff)
                                    thisWeekStart.setHours(0, 0, 0, 0)
                                    const today = new TZDate()
                                    today.setHours(23, 59, 59, 999)
                                    setRange({from: thisWeekStart, to: today})
                                }}
                            >
                                This Week
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const last7DaysEnd = new TZDate()
                                    last7DaysEnd.setHours(23, 59, 59, 999)
                                    const last7DaysStart = new TZDate()
                                    last7DaysStart.setDate(last7DaysStart.getDate() - 6)
                                    last7DaysStart.setHours(0, 0, 0, 0)
                                    setRange({from: last7DaysStart, to: last7DaysEnd})
                                }}
                            >
                                Last 7 Days
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const to = new TZDate()
                                    to.setHours(23, 59, 59, 999)
                                    const from = new TZDate()
                                    from.setDate(1)
                                    from.setHours(0, 0, 0, 0)
                                    setRange({from, to})
                                }}
                            >
                                This Month
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const thisYearStart = new TZDate()
                                    thisYearStart.setMonth(0, 1)
                                    thisYearStart.setHours(0, 0, 0, 0)
                                    const today = new TZDate()
                                    today.setHours(23, 59, 59, 999)
                                    setRange({from: thisYearStart, to: today})
                                }}
                            >
                                This Year
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const lastYearEnd = new TZDate()
                                    lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1)
                                    lastYearEnd.setMonth(11, 31)
                                    lastYearEnd.setHours(23, 59, 59, 999)
                                    const lastYearStart = new TZDate()
                                    lastYearStart.setFullYear(lastYearStart.getFullYear() - 1)
                                    lastYearStart.setMonth(0, 1)
                                    lastYearStart.setHours(0, 0, 0, 0)
                                    setRange({from: lastYearStart, to: lastYearEnd})
                                }}
                            >
                                Last Year
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="mt-10">
                {isLoading && <p>Loading data...</p>}
                {error && <p>Error loading data.</p>}
                {isRefetching && <p>Updating data...</p>}
                <DataPage data={data} />
                <OrderItem data={data} />
                <OrderChart />
            </div>
        </section>
    )
}
