import React from "react";
import {
    Box,
    Typography,
    Link as MuiLink,
    IconButton,
    Stack,
    TextField,
    Button,
    useTheme,
    Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { tokens } from "~/utils/theme";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = (): React.JSX.Element => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primary[900],
                py: 3,
                gap: 2,
                color: colors.primary[100],
            }}
            component="footer"
        >
            <Stack direction="row" spacing={8} sx={{ flexWrap: "wrap", justifyContent: "center", mb: 1 }}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Explore
                    </Typography>
                    <Stack spacing={1}>
                        <NavLink to="/movies" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <MovieIcon />
                                <Typography>Movies</Typography>
                            </Stack>
                        </NavLink>
                        <NavLink to="/series" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocalMoviesIcon />
                                <Typography>Series</Typography>
                            </Stack>
                        </NavLink>
                        <NavLink to="/genres" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <SubtitlesIcon />
                                <Typography>Genres</Typography>
                            </Stack>
                        </NavLink>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Account
                    </Typography>
                    <Stack spacing={1}>
                        <NavLink to="/login" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LockOpenIcon />
                                <Typography>Sign In</Typography>
                            </Stack>
                        </NavLink>
                        <NavLink to="/register" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <AppRegistrationIcon />
                                <Typography>Sign Up</Typography>
                            </Stack>
                        </NavLink>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Follow Us
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <IconButton
                            component={MuiLink}
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener"
                            sx={{ color: colors.primary[100] }}
                        >
                            <FacebookIcon />
                        </IconButton>
                        <IconButton
                            component={MuiLink}
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener"
                            sx={{ color: colors.primary[100] }}
                        >
                            <TwitterIcon />
                        </IconButton>
                        <IconButton
                            component={MuiLink}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener"
                            sx={{ color: colors.primary[100] }}
                        >
                            <InstagramIcon />
                        </IconButton>
                        <IconButton
                            component={MuiLink}
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener"
                            sx={{ color: colors.primary[100] }}
                        >
                            <YouTubeIcon />
                        </IconButton>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Newsletter
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField variant="outlined" size="small" placeholder="Email" />
                        <Button variant="contained">Subscribe</Button>
                    </Stack>
                </Box>
            </Stack>
            <Box width={"100%"}>
                <Divider sx={{ borderBottomWidth: 3, background: colors.primary[100] }} />
            </Box>
            <Box>
                <Typography variant="body2">Copyright © 2024 | MovieLandia24</Typography>
            </Box>
        </Box>
    );
};

export default Footer;
