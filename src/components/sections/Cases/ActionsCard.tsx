import {
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
} from "@mui/material";
import { Space_Grotesk } from "next/font/google";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";


const spaceGroteskBold = Space_Grotesk({ subsets: ["latin"], weight: "700" });

export default function ActionsCard() {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                boxShadow: 0,                     // lighter in dark mode
                borderColor: 'divider',
                bgcolor: 'white',                 // light mode
                '.dark &': {
                    bgcolor: '#0f172a',            // tailwind slate-900
                    borderColor: '#1f2937',        // tailwind slate-700
                },
            }}
        >
            <CardContent>
                <Typography
                    variant="subtitle1"
                    className={spaceGroteskBold.className}
                    sx={{
                        mb: 2,
                        fontWeight: 700,           // ensure bold
                        color: "text.primary",     // light mode from theme
                        ".dark &": { color: "#fff" } // Tailwind dark mode → white
                    }}
                >
                    Actions
                </Typography>

                <Stack spacing={2}>
                    {/* Primary action */}
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CampaignOutlinedIcon/>}
                        onClick={() => alert("Broadcast Approved ✅")}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "600",
                        }}
                    >
                        Approve for Broadcast
                    </Button>

                    {/* Neutral action */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        startIcon={<PersonAddAltOutlinedIcon/>}
                        onClick={() => alert("Assigned 👤")}
                        sx={{borderRadius: 2, textTransform: "none"}}
                    >
                        Assign to Team Member
                    </Button>

                    {/* Warning action */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        startIcon={<FlagOutlinedIcon/>}
                        onClick={() => alert("Flagged 🚩")}
                        sx={{borderRadius: 2, textTransform: "none"}}
                    >
                        Flag for Manual Review
                    </Button>

                    {/* Danger action */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<ContentCopyOutlinedIcon/>}
                        onClick={() => alert("Marked as Duplicate 🗂️")}
                        sx={{borderRadius: 2, textTransform: "none"}}
                    >
                        Mark as Duplicate
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
