// components/sections/Cases/CasesPage.tsx
import React, { useEffect, useState } from "react";
import { CasesTable } from "@/components/sections/Cases/CasesTable";
import CaseDetails from "@/components/sections/Cases/CaseDetails";
import { mockCases } from "@/components/constants";
import type { Case } from "@/components/constants";

export function CasesPage() {
    const [selectedRow, setSelectedRow] = useState<Case | null>(null);

    useEffect(() => {
        if (!selectedRow && mockCases.length) {
            setSelectedRow(mockCases[0]);
        }
    }, [selectedRow]);

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cases</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 space-grotesk-medium">
                    Manage and review reported stolen vehicles. Browse case records, view photos,
                    reporter details, and cross-check results, and take actions such as approving
                    for broadcast or assigning to team members.
                </p>
            </div>

            <CasesTable
                mockCases={mockCases}
                onSelect={(c: Case) => setSelectedRow(c)}
            />

            {selectedRow && (
                <CaseDetails
                    selected={{
                        id: selectedRow.id,
                        photos: selectedRow.photos ?? [],
                        reporter: selectedRow.reporter ?? {
                            name: "Masked for Privacy",
                            phone: "Masked for Privacy",
                            email: "Masked for Privacy",
                        },
                        crossChecks: selectedRow.crossChecks ?? [],
                    }}
                />
            )}
        </div>
    );
}
