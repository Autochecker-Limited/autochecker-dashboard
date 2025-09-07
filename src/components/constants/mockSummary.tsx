import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import { SvgIconComponent } from "@mui/icons-material";

export type Summary = {
    label: string;
    value: string | number;
    delta: string;
    icon: SvgIconComponent;
    color?: string;
};

export const mockSummary: Summary[] = [
    {
        label: "Case Management",
        value: 125,
        delta: "+5%",
        icon: FolderOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    },
    {
        label: "VIN/Plate Checks",
        value: 2345,
        delta: "+12%",
        icon: SearchOutlinedIcon,
        color: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    },
    {
        label: "Subscriptions",
        value: "$4,500",
        delta: "-2%",
        icon: CreditCardOutlinedIcon,
        color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    },
    {
        label: "Broadcasts",
        value: 150,
        delta: "+8%",
        icon: CampaignOutlinedIcon,
        color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
    },
];
