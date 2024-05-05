import React from "react";
import { Typography } from "@mui/material";

export const Footer = (): React.JSX.Element => {
    return (
        <footer className="footer-welcome">
            <Typography>
                Copyright © 2021 - 2022 | movielandia24.so - Filma dhe Seriale HD me titra shqip /
                NetFlix shqip!
            </Typography>
            <Typography>
                Disclaimer: This site does not store any files on its server! All contents are
                provided by non-affiliated third parties!
            </Typography>
        </footer>
    );
};
