import * as React from "react";
import { CasesTable } from "@/components/sections/Cases/CasesTable";



export function CasesPage() {
    return (
        <div>
            <CasesTable mockCases={[]} onSelect={
                function(c:
                         { id: number | string; ob: string; vin: string;
                             status: "Open" | "In Progress" | "Resolved" | "Closed" | string;
                             assignee: string; }): void {
                throw new Error("Function not implemented.");
            } }/>
        </div>

    );
}
