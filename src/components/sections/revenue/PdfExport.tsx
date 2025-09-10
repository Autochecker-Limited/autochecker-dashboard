// components/revenue/PdfExport.tsx

// No JSX here—just typed helpers you can call from client components.

export type TxRow = {
    date: string;
    amount: number;
    type: string; // e.g., "M-Pesa" | "Stripe"
    status: "Completed" | "Failed";
};

export type CampaignRow = {
    name: string;
    start: string;
    end: string;
    impressions: number;
    earnings: number;
};

// --- Shared types for dynamic imports (no `any`) ----------------------------
type JsPDFInstance = import("jspdf").jsPDF;
type JsPDFCtor = new (options?: { unit?: string; format?: string | number[] }) => JsPDFInstance;
type AutoTableUserOptions = import("jspdf-autotable").UserOptions;
type AutoTableFn = (doc: JsPDFInstance, options: AutoTableUserOptions) => JsPDFInstance;

// Augment jsPDF with the plugin’s runtime property (kept optional).
type JsPDFWithAutoTable = JsPDFInstance & { lastAutoTable?: { finalY: number } };

// Create a new typed jsPDF instance via dynamic import (no `any`)
async function createDoc(): Promise<JsPDFInstance> {
    const mod = await import("jspdf");
    const Ctor = (mod.default as unknown) as JsPDFCtor;
    return new Ctor({ unit: "pt", format: "a4" });
}

// Get a typed autoTable function via dynamic import (no `any`)
async function getAutoTable(): Promise<AutoTableFn> {
    const mod = await import("jspdf-autotable");
    return (mod.default as unknown) as AutoTableFn;
}

/** Export up to 50 transaction rows to a PDF */
export async function exportTransactionsPdf(
    rows: TxRow[],
    fmtUSD: (n: number) => string
): Promise<void> {
    const [doc, autoTable] = await Promise.all([createDoc(), getAutoTable()]);

    const maxRows = rows.slice(0, 50);
    const body = maxRows.map((t) => [t.date, t.type, t.status, fmtUSD(t.amount)]);

    doc.setFontSize(14);
    doc.text("Transactions", 40, 40);

    autoTable(doc, {
        startY: 60,
        head: [["Date", "Type", "Status", "Amount"]],
        body,
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [30, 41, 59] }, // slate-800
        margin: { left: 40, right: 40 },
    });

    doc.save(`transactions_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/** Export up to 50 campaign rows to a PDF */
export async function exportCampaignsPdf(
    rows: CampaignRow[],
    fmtUSD: (n: number) => string
): Promise<void> {
    const [doc, autoTable] = await Promise.all([createDoc(), getAutoTable()]);

    const maxRows = rows.slice(0, 50);
    const body = maxRows.map((c) => [
        c.name,
        c.start,
        c.end,
        c.impressions.toLocaleString("en-US"),
        fmtUSD(c.earnings),
    ]);

    doc.setFontSize(14);
    doc.text("Ad Campaigns", 40, 40);

    autoTable(doc, {
        startY: 60,
        head: [["Campaign", "Start", "End", "Impressions", "Earnings"]],
        body,
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 },
        columnStyles: { 0: { cellWidth: 180 } }, // wider campaign name
    });

    doc.save(`campaigns_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/** Optional: one PDF containing both tables (each capped at 50 rows) */
export async function exportAllPdf(
    txRows: TxRow[],
    cpRows: CampaignRow[],
    fmtUSD: (n: number) => string
): Promise<void> {
    const [doc, autoTable] = await Promise.all([createDoc(), getAutoTable()]);

    // Transactions
    doc.setFontSize(14);
    doc.text("Transactions", 40, 40);
    autoTable(doc, {
        startY: 60,
        head: [["Date", "Type", "Status", "Amount"]],
        body: txRows.slice(0, 50).map((t) => [t.date, t.type, t.status, fmtUSD(t.amount)]),
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 },
    });

    // Campaigns (continue after last table / add page if needed)
    const docAT = doc as JsPDFWithAutoTable;
    let y = docAT.lastAutoTable?.finalY ?? 60;
    if (y > 700) {
        doc.addPage();
        y = 40;
    } else {
        y += 30;
    }

    doc.setFontSize(14);
    doc.text("Ad Campaigns", 40, y);
    autoTable(doc, {
        startY: y + 20,
        head: [["Campaign", "Start", "End", "Impressions", "Earnings"]],
        body: cpRows
            .slice(0, 50)
            .map((c) => [c.name, c.start, c.end, c.impressions.toLocaleString("en-US"), fmtUSD(c.earnings)]),
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 },
        columnStyles: { 0: { cellWidth: 180 } },
    });

    doc.save(`revenue_${new Date().toISOString().slice(0, 10)}.pdf`);
}
