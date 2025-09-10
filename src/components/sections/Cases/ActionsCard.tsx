import {
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
} from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

export default function ActionsCard() {
    return (
        <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
                <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: "bold" }}
                    color="text.primary"
                >
                    Actions
                </Typography>

                <Stack spacing={2}>
                    {/* Primary action */}
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CampaignOutlinedIcon />}
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
                        startIcon={<PersonAddAltOutlinedIcon />}
                        onClick={() => alert("Assigned 👤")}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                        Assign to Team Member
                    </Button>

                    {/* Warning action */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        startIcon={<FlagOutlinedIcon />}
                        onClick={() => alert("Flagged 🚩")}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                        Flag for Manual Review
                    </Button>

                    {/* Danger action */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<ContentCopyOutlinedIcon />}
                        onClick={() => alert("Marked as Duplicate 🗂️")}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                        Mark as Duplicate
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
