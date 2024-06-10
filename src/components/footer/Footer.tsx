import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

const Footer = (): React.JSX.Element => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                placeItems: "center",
                placeContent: "center",
                backgroundColor: colors.primary[900],
                padding: 6,
            }}
            component={"footer"}
        >
            <Typography>Copyright © 2024 | MovieLandia24</Typography>
        </Box>
    );
};

export default Footer;
