import { Box, Typography } from "@mui/material";
import React from "react";

export default function Error404(): React.JSX.Element {
    return (
        <Box sx={{ display: "flex", placeItems: "center", placeContent: "center" }}>
            <Typography>ERROR 404</Typography>
        </Box>
    );
}
