import React from 'react'
import { cn } from '@/lib/utils'
import { Landmark, PackageCheck, Truck, Clock } from 'lucide-react'

export type TrackingTimelineItem = {
    id: string
    message: string
    at: Date
}

function iconForMessage(message: string) {
    const m = message.toLowerCase()
    if (m.includes('deliver')) return PackageCheck
    if (m.includes('ship') || m.includes('dispatch')) return Truck
    if (m.includes('confirm') || m.includes('received') || m.includes('placed')) return Landmark
    return Clock
}

export default function TrackingTimeline({
    items,
    className,
}: {
    items: TrackingTimelineItem[]
    className?: string
}) {
    if (!items.length) {
        return (
            <div className={cn('rounded-lg border bg-card p-6 text-sm text-muted-foreground', className)}>
                No tracking updates yet. Check back soon.
            </div>
        )
    }

    return (
        <ol className={cn('space-y-4', className)}>
            {items.map((item, index) => {
                const Icon = iconForMessage(item.message)
                const isLatest = index === 0

                return (
                    <li key={item.id} className="relative">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'grid size-9 place-items-center',
                                        isLatest && 'border-primary/40 bg-primary/5',
                                    )}
                                >
                                    <Icon className={cn('size-8 text-muted-foreground', isLatest && 'text-primary')} />
                                </div>
                                {index !== items.length - 1 && (
                                    <div className="mt-2 h-full w-px bg-border" />
                                )}
                            </div>

                            <div className="flex-1 pb-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className={cn('font-medium', isLatest && 'text-foreground')}>{item.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.at.toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                            timeZone: 'Asia/Dhaka',
                                        })}
                                    </p>
                                </div>
                                {isLatest && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Latest update
                                    </p>
                                )}
                            </div>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}

