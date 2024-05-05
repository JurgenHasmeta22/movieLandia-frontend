import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

export const Footer = (): React.JSX.Element => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                placeItems: "center",
                placeContent: "center",
                rowGap: 2,
                backgroundColor: colors.primary[900],
                padding: 3
            }}
        >
            <Typography color={colors.primary[100]}>
                Copyright © 2021 - 2022 | movielandia24.so - Filma dhe Seriale HD me titra shqip /
                NetFlix shqip!
            </Typography>
            <Typography color={colors.primary[100]}>
                Disclaimer: This site does not store any files on its server! All contents are
                provided by non-affiliated third parties!
            </Typography>
        </Box>
    );
};
