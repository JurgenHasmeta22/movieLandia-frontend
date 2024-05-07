import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import type IGenre from "~/types/IGenre";
import movieService from "~/services/movieService";
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "~/utils/theme";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Clear, CloseOutlined, Search } from "@mui/icons-material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useResizeWindow } from "~/hooks/useResizeWindow";

export const Header = (): React.JSX.Element => {
    const [options, setOptions] = useState<any>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);
    const [anchorElGenresMobile, setAnchorElGenresMobile] = useState<null | HTMLElement>(null);

    const isPageShrunk = useResizeWindow(); // Custom hook for handling resize logic state and useEffect

    const { user, setUser, openDrawer, mobileOpen, setMobileOpen, setOpenDrawer } = useStore();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleDrawerToggle = () => {
        setOpenDrawer(false);
    };

    function handleLogout(): void {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    }

    function redirectToProfile(user: any): void {
        navigate("/profile");
    }

    async function getGenres(): Promise<void> {
        try {
            const response: IGenre[] = await movieService.getGenresWithNoPagination();
            setGenres(response);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchData(): Promise<void> {
        try {
            await getGenres();
        } catch (error) {
            console.log(error);
        }
    }

    const openMenuGenres = (event: any) => {
        setAnchorElGenres(event.currentTarget);
    };

    const closeMenuGenres = () => {
        setAnchorElGenres(null);
    };

    const openMenuGenresMobile = (event: any) => {
        setAnchorElGenresMobile(event.currentTarget);
    };

    const closeMenuGenresMobile = () => {
        setAnchorElGenresMobile(null);
    };

    const openMenuProfile = (event: any) => {
        setAnchorElProfile(event.currentTarget);
    };

    const closeMenuProfile = () => {
        setAnchorElProfile(null);
    };

    useEffect(() => {
        fetchData().catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        for (const genre of genres) {
            const option = {
                value: genre.name,
                label: genre.name,
            };

            setOptions([...options, option]);
        }
    }, []);

    useEffect(() => {
        if (isPageShrunk) {
            setMobileOpen(true);
        } else {
            setMobileOpen(false);
            setOpenDrawer(false);
        }
    }, [isPageShrunk]);

    return (
        <>
            <AppBar position="static" component={"nav"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        backgroundColor: colors.primary[900],
                        padding: 2,
                    }}
                >
                    {mobileOpen ? (
                        <Box>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={() => {
                                    setOpenDrawer(true);
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    placeItems: "center",
                                    columnGap: 6,
                                }}
                            >
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        fontSize: "20px",
                                        color: colors.primary[100],
                                        cursor: "pointer",
                                    }}
                                    to="/movies"
                                >
                                    MovieLandia24
                                </Link>
                                <List sx={{ display: "flex", flexDirection: "row" }}>
                                    <ListItem>
                                        <NavLink
                                            style={{
                                                textDecoration: "none",
                                                fontSize: "20px",
                                                color: colors.primary[100],
                                                cursor: "pointer",
                                            }}
                                            to="/movies"
                                        >
                                            Movies
                                        </NavLink>
                                    </ListItem>
                                    <ListItem
                                        onMouseEnter={openMenuGenres}
                                        onMouseLeave={closeMenuGenres}
                                        // onClick={() => {
                                        //     navigate(`/genres`);
                                        // }}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <Typography
                                            style={{
                                                textDecoration: "none",
                                                fontSize: 20,
                                                color: colors.primary[100],
                                            }}
                                        >
                                            Genres
                                        </Typography>
                                        <Menu
                                            anchorEl={anchorElGenres}
                                            open={Boolean(anchorElGenres)}
                                            onClose={closeMenuGenres}
                                            MenuListProps={{
                                                onMouseLeave: closeMenuGenres,
                                                style: { padding: 10 },
                                            }}
                                        >
                                            {genres.map((genre) => (
                                                <MenuItem
                                                    key={genre.id}
                                                    onClick={() => {
                                                        closeMenuGenres();
                                                        navigate(`/genres/${genre.name}`);
                                                    }}
                                                >
                                                    {genre.name}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </ListItem>
                                    <ListItem>
                                        <NavLink
                                            style={{
                                                textDecoration: "none",
                                                fontSize: "20px",
                                                color: colors.primary[100],
                                                cursor: "pointer",
                                            }}
                                            to="/series"
                                        >
                                            Series
                                        </NavLink>
                                    </ListItem>
                                    <ListItem>
                                        <NavLink
                                            style={{
                                                textDecoration: "none",
                                                fontSize: 20,
                                                color: colors.primary[100],
                                                cursor: "pointer",
                                            }}
                                            to="/genres/NETFLIX"
                                        >
                                            Netflix
                                        </NavLink>
                                    </ListItem>
                                </List>
                            </Box>
                            <Box sx={{ display: "flex", placeItems: "center", columnGap: 4 }}>
                                <TextField
                                    placeholder="Search for movies..."
                                    value={
                                        searchParams.get("search") ? searchParams.get("search") : ""
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value.length > 0) {
                                            navigate(`/movies?search=${value}`);
                                        } else {
                                            navigate("/movies");
                                        }
                                    }}
                                    InputProps={{
                                        color: "secondary",
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Clear
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        if (searchParams.get("search")) {
                                                            navigate("/movies");
                                                        }
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {user !== null ? (
                                    <Box>
                                        <IconButton
                                            id="buttonProfile"
                                            aria-controls={
                                                Boolean(anchorElProfile) ? "menuProfile" : undefined
                                            }
                                            aria-haspopup="true"
                                            aria-expanded={
                                                Boolean(anchorElProfile) ? "true" : undefined
                                            }
                                            onClick={openMenuProfile}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "10px",
                                            }}
                                            disableRipple={true}
                                        >
                                            <PersonOutlinedIcon color="action" fontSize="large" />
                                            {user?.userName}
                                        </IconButton>
                                        <Menu
                                            id="menuProfile"
                                            anchorEl={anchorElProfile}
                                            open={Boolean(anchorElProfile)}
                                            onClose={closeMenuProfile}
                                            MenuListProps={{
                                                "aria-labelledby": "buttonProfile",
                                            }}
                                        >
                                            <MenuItem
                                                onClick={redirectToProfile}
                                                style={{ color: colors.primary[100] }}
                                            >
                                                Profili im
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleLogout}
                                                style={{ color: colors.primary[100] }}
                                            >
                                                Log Out
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                ) : (
                                    <>
                                        <Button
                                            color="secondary"
                                            variant="outlined"
                                            size="large"
                                            onClick={function () {
                                                navigate("/login");
                                            }}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                columnGap: 1,
                                                padding: 2,
                                            }}
                                        >
                                            <LockOpenIcon />
                                            <Typography>Sign In</Typography>
                                        </Button>
                                        <Button
                                            color="secondary"
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                columnGap: 1,
                                                padding: 2,
                                            }}
                                            onClick={function () {
                                                navigate("/register");
                                            }}
                                        >
                                            <AppRegistrationIcon />
                                            <Typography>Sign Up</Typography>
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                open={openDrawer}
                onClose={handleDrawerToggle}
                component={"nav"}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            placeContent: "end",
                            marginTop: 2,
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                setOpenDrawer(false);
                            }}
                        >
                            <CloseOutlined />
                        </IconButton>
                    </Box>
                    <List
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 1,
                            alignItems: "center",
                        }}
                    >
                        <ListItem>
                            <Link
                                style={{
                                    textDecoration: "none",
                                    fontSize: "20px",
                                    color: colors.primary[100],
                                    cursor: "pointer",
                                }}
                                to="/movies"
                            >
                                MovieLandia24
                            </Link>
                        </ListItem>
                        <ListItem>
                            <NavLink
                                style={{
                                    textDecoration: "none",
                                    fontSize: "20px",
                                    color: colors.primary[100],
                                    cursor: "pointer",
                                }}
                                to="/movies"
                            >
                                Movies
                            </NavLink>
                        </ListItem>
                        <ListItem
                            onMouseEnter={openMenuGenresMobile}
                            onMouseLeave={closeMenuGenresMobile}
                        >
                            <Typography
                                style={{
                                    textDecoration: "none",
                                    fontSize: 20,
                                    color: colors.primary[100],
                                }}
                            >
                                Genres
                            </Typography>
                            <Menu
                                anchorEl={anchorElGenresMobile}
                                open={Boolean(anchorElGenresMobile)}
                                onClose={closeMenuGenresMobile}
                                MenuListProps={{
                                    onMouseLeave: closeMenuGenresMobile,
                                    style: { padding: 10 },
                                }}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                {genres.map((genre) => (
                                    <MenuItem
                                        key={genre.id}
                                        onClick={() => {
                                            closeMenuGenres();
                                            navigate(`/genres/${genre.name}`);
                                        }}
                                    >
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </ListItem>
                        <ListItem>
                            <NavLink
                                style={{
                                    textDecoration: "none",
                                    fontSize: "20px",
                                    color: colors.primary[100],
                                    cursor: "pointer",
                                }}
                                to="/series"
                            >
                                Series
                            </NavLink>
                        </ListItem>
                        <ListItem>
                            <NavLink
                                style={{
                                    textDecoration: "none",
                                    fontSize: 20,
                                    color: colors.primary[100],
                                    cursor: "pointer",
                                }}
                                to="/genres/NETFLIX"
                            >
                                Netflix
                            </NavLink>
                        </ListItem>
                        <ListItem
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                placeContent: "center",
                                rowGap: 2,
                            }}
                        >
                            <TextField
                                placeholder="Search for movies..."
                                value={searchParams.get("search") ? searchParams.get("search") : ""}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value.length > 0) {
                                        navigate(`/movies?search=${value}`);
                                    } else {
                                        navigate("/movies");
                                    }
                                }}
                                InputProps={{
                                    color: "secondary",
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Clear
                                                sx={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    if (searchParams.get("search")) {
                                                        navigate("/movies");
                                                    }
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {user !== null ? (
                                <Box>
                                    <IconButton
                                        id="buttonProfile"
                                        aria-controls={
                                            Boolean(anchorElProfile) ? "menuProfile" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            Boolean(anchorElProfile) ? "true" : undefined
                                        }
                                        onClick={openMenuProfile}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "10px",
                                        }}
                                        disableRipple={true}
                                    >
                                        <PersonOutlinedIcon color="action" fontSize="large" />
                                        {user?.userName}
                                    </IconButton>
                                    <Menu
                                        id="menuProfile"
                                        anchorEl={anchorElProfile}
                                        open={Boolean(anchorElProfile)}
                                        onClose={closeMenuProfile}
                                        MenuListProps={{
                                            "aria-labelledby": "buttonProfile",
                                        }}
                                    >
                                        <MenuItem
                                            onClick={redirectToProfile}
                                            style={{ color: colors.primary[100] }}
                                        >
                                            Profili im
                                        </MenuItem>
                                        <MenuItem
                                            onClick={handleLogout}
                                            style={{ color: colors.primary[100] }}
                                        >
                                            Log Out
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            ) : (
                                <>
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        size="medium"
                                        onClick={function () {
                                            navigate("/login");
                                        }}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            columnGap: 1,
                                            padding: 1,
                                        }}
                                    >
                                        <LockOpenIcon />
                                        <Typography>Sign In</Typography>
                                    </Button>
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            columnGap: 1,
                                            padding: 1,
                                        }}
                                        onClick={function () {
                                            navigate("/register");
                                        }}
                                    >
                                        <AppRegistrationIcon />
                                        <Typography>Sign Up</Typography>
                                    </Button>
                                </>
                            )}
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
