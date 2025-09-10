
// --- Mock data --------------------------------------------------------------
// components/constants/mockSmallCards.ts
export type SmallCard = {
    label: string;
    value: string | number;
};

export const mockSmallCards: SmallCard[] = [
    { label: "Stolen Reports (Today)", value: 12 },
    { label: "Stolen Reports (Week)", value: 75 },
    { label: "VIN/Plate Checks", value: 250 },
    { label: "Broadcasts Sent", value: 5 },
    { label: "Revenue", value: "$1,500" },
    { label: "API Status", value: "All Systems Operational" },
];


// export const mockActivity = [
//     { label: "New Stolen Report", time: "10 minutes ago", icon: "" },
//     { label: "Successful Payment", time: "25 minutes ago", icon: "💵" },
//     { label: "Broadcast Sent", time: "1 hour ago", icon: "📡" },
//     { label: "VIN Check", time: "2 hours ago", icon: "🔎" },
//     { label: "New Stolen Report", time: "3 hours ago", icon: "🚗" },
// ];


export const mockCases = [
    {
        id: 12345,
        ob: "OB2023-001",
        vin: "1234…CDEFG",
        plate: "BER-AB 123",
        status: "Pending Review",
        assignee: "Alex H.",
        photos: [
            "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1200&auto=format&fit=crop",
        ],
        reporter: { name: "Masked for Privacy", phone: "Masked", email: "Masked" },
        crossChecks: [
            { name: "Database", match: true },
            { name: "External Database", match: true },
        ],
    },
    {
        id: 67890,
        ob: "OB2023-002",
        vin: "XYZ123",
        plate: "M-XY 789",
        status: "Approved",
        assignee: "Ben C.",
        photos: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
        ],
        reporter: { name: "Masked for Privacy", phone: "Masked", email: "Masked" },
        crossChecks: [
            { name: "Database", match: true },
            { name: "External Database", match: false },
        ],
    },
    {
        id: 11223,
        ob: "OB2023-003",
        vin: "9876…FEDCBA",
        plate: "B-AC 456",
        status: "Duplicate",
        assignee: "Carla M.",
        photos: [],
        reporter: { name: "Masked for Privacy", phone: "Masked", email: "Masked" },
        crossChecks: [
            { name: "Database", match: false },
            { name: "External Database", match: false },
        ],
    },
];