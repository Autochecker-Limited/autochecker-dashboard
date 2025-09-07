import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { SvgIconComponent } from "@mui/icons-material";

export type Activity = {
    label: string;
    time: string;
    icon: SvgIconComponent;
    color?: string;
};

export const mockActivity: Activity[] = [
    {
        label: "New Stolen Report",
        time: "10 minutes ago",
        icon: DirectionsCarOutlinedIcon,
        color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    },
    {
        label: "Successful Payment",
        time: "25 minutes ago",
        icon: AttachMoneyOutlinedIcon,
        color: "bg-emerald-100 text-emerald-500 dark:bg-emerald-400/20 dark:text-emerald-400",
    },
    {
        label: "Broadcast Sent",
        time: "1 hour ago",
        icon: CampaignOutlinedIcon,
        color: "bg-cyan-100 text-cyan-400 dark:bg-cyan-400/20 dark:text-cyan-400",
    },
    {
        label: "VIN Check",
        time: "2 hours ago",
        icon: SearchOutlinedIcon,
        color: "bg-purple-100 text--600 dark:bg-purple-500/20 dark:text-purple-400",},
];