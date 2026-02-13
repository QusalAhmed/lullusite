'use client';

import React, { useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReactToPrint } from "react-to-print";

// ShadCN
import { Button } from "@/components/ui/button";

// Local
import Invoice from "./Invoice";

function parseIdsParam(idsParam: string | null): string[] {
    if (!idsParam) return []
    return idsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
}

export default function InvoicePage() {
    const searchParams = useSearchParams()
    const componentRef = useRef<HTMLDivElement>(null);

    const orderIds = useMemo(() => {
        // supports: ?ids=a,b,c or repeated ?id=a&id=b
        const ids = parseIdsParam(searchParams.get('ids'))
        const repeated = searchParams.getAll('id')
        return [...ids, ...repeated].filter(Boolean)
    }, [searchParams]);

    const reactToPrintContent = () => {
        return componentRef.current;
    };

    const handlePrint = useReactToPrint({
        documentTitle: 'Invoice',
        pageStyle: `
            @media print {
                @page {
                    size: A4;
                    margin: 10mm;
                }
                body {
                    -webkit-print-color-adjust: exact;
                }
            }
        `,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 print:hidden">
                <Button onClick={() => handlePrint(reactToPrintContent)} disabled={orderIds.length === 0}>
                    Print
                </Button>
            </div>

            <div ref={componentRef}>
                <Invoice orderIds={orderIds} />
            </div>
        </div>
    );
};
