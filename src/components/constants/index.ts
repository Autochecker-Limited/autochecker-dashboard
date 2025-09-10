export * from "./mockdata";




// Reuse these if you already declared them elsewhere
export type CrossCheck = { name: string; match: boolean };
export type Reporter = { name: string; phone: string; email: string };

export type Case = {
    id: string | number;
    ob: string;
    vin: string;
    plate?: string;
    status: string;
    assignee: string;
    photos?: string[];
    reporter?: Reporter;
    crossChecks?: CrossCheck[];
};