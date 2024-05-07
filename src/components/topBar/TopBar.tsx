import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens, ColorModeContext } from "~/utils/theme";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "~/store/store";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import MenuIcon from "@mui/icons-material/Menu";

const TopBar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user, unsetUser, openSidebar, setOpenSidebar } = useStore();

    const navigate = useNavigate();

    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const open = Boolean(anchorEl);

    const { removeItem } = useLocalStorage("user");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        removeItem();
        unsetUser();
        navigate("/login");
    };

    const handleRedirectToProfile = () => {
        navigate("/profile", {
            state: {
                userId: user?.userId,
                from: "Perdoruesit",
            },
        });
    };

    return (
        <AppBar position="static">
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: colors.primary[900],
                }}
            >
                <Box display={"flex"} justifyContent={"start"}>
                    {!openSidebar && (
                        <IconButton
                            onClick={() => {
                                setOpenSidebar(true);
                            }}
                        >
                            <MenuIcon fontSize="medium" />
                        </IconButton>
                    )}
                </Box>
                <Box display={"flex"} flexDirection={"row"}>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? (
                            <DarkModeOutlinedIcon />
                        ) : (
                            <LightModeOutlinedIcon />
                        )}
                    </IconButton>
                    <IconButton
                        id="buttonProfile"
                        aria-controls={open ? "menuProfile" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                        disableRipple={true}
                    >
                        <PersonOutlinedIcon color="action" fontSize="medium" />
                        {user?.username}
                    </IconButton>
                    <Menu
                        id="menuProfile"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "buttonProfile",
                        }}
                    >
                        <MenuItem
                            onClick={handleRedirectToProfile}
                            style={{ color: colors.primary[100] }}
                        >
                            Profili im
                        </MenuItem>
                        <MenuItem>
                            <Link
                                to="/changePassword"
                                style={{ color: colors.primary[100], textDecoration: "none" }}
                            >
                                Ndrysho passwordin
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleLogout} style={{ color: colors.primary[100] }}>
                            Logohu jasht
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
