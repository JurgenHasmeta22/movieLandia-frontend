import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/store";
import type IGenre from "~/types/IGenre";
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
    Stack,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import { ColorModeContext, tokens } from "~/utils/theme";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Clear, CloseOutlined, Search } from "@mui/icons-material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useResizeWindow } from "~/hooks/useResizeWindow";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import genreService from "~/services/api/genreService";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

export const Header = (): React.JSX.Element => {
    const [options, setOptions] = useState<any>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);
    const [anchorElGenresMobile, setAnchorElGenresMobile] = useState<null | HTMLElement>(null);

    const isPageShrunk = useResizeWindow();
    const { user, setUser, openDrawer, mobileOpen, setMobileOpen, setOpenDrawer } = useStore();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleDrawerToggle = () => {
        setOpenDrawer(false);
    };

    function handleLogout(): void {
        localStorage.removeItem("token");
        setUser(null);
        closeMenuProfile();
        navigate("/login");
    }

    function redirectToProfile(user: any): void {
        navigate("/profile");
    }

    async function getGenres(): Promise<void> {
        try {
            const response = await genreService.getGenres({});
            setGenres(response.rows);
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
            <AppBar position="static" component={"header"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: `${mobileOpen ? "justify-between" : "space-around"}`,
                        flexWrap: "wrap",
                        backgroundColor: colors.primary[900],
                        py: 2,
                    }}
                    component={"nav"}
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
                        <Stack
                            flexDirection={"row"}
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            columnGap={4}
                            flexWrap={"wrap"}
                        >
                            <Box>
                                <NavLink
                                    style={({ isActive, isPending, isTransitioning }) => {
                                        return {
                                            fontWeight: isActive ? "bold" : "",
                                            color: isActive
                                                ? colors.greenAccent[500]
                                                : colors.primary[100],
                                            viewTransitionName: isTransitioning ? "slide" : "",
                                            textDecoration: "none",
                                            fontSize: "20px",
                                            textDecorationLine: isActive ? "underline" : "none",
                                            textDecorationColor: isActive
                                                ? colors.greenAccent[500]
                                                : "",
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "row",
                                            columnGap: 1,
                                            alignItems: "center",
                                        };
                                    }}
                                    to="/"
                                >
                                    MovieLandia24
                                </NavLink>
                            </Box>
                            <Box>
                                <List sx={{ display: "flex", flexDirection: "row" }}>
                                    <ListItem>
                                        <NavLink
                                            style={({ isActive, isPending, isTransitioning }) => {
                                                return {
                                                    fontWeight: isActive ? "bold" : "",
                                                    color: isActive
                                                        ? colors.greenAccent[500]
                                                        : colors.primary[100],
                                                    viewTransitionName: isTransitioning
                                                        ? "slide"
                                                        : "",
                                                    textDecoration: "none",
                                                    fontSize: "16px",
                                                    textDecorationLine: isActive
                                                        ? "underline"
                                                        : "none",
                                                    textDecorationColor: isActive
                                                        ? colors.greenAccent[500]
                                                        : "",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                };
                                            }}
                                            to="/movies"
                                        >
                                            <MovieIcon fontSize={"large"} />
                                            Movies
                                        </NavLink>
                                    </ListItem>
                                    <ListItem
                                        onMouseEnter={openMenuGenres}
                                        onMouseLeave={closeMenuGenres}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <Typography
                                            style={{
                                                textDecoration: "none",
                                                fontSize: 16,
                                                color: colors.primary[100],
                                                display: "flex",
                                                flexDirection: "row",
                                                columnGap: 2,
                                                alignItems: "center",
                                            }}
                                        >
                                            <SubtitlesIcon fontSize={"large"} />
                                            Genres
                                        </Typography>
                                        <Menu
                                            anchorEl={anchorElGenres}
                                            open={Boolean(anchorElGenres)}
                                            onClose={closeMenuGenres}
                                            MenuListProps={{
                                                onMouseLeave: closeMenuGenres,
                                                sx: {
                                                    display: "grid",
                                                    height: "auto",
                                                    width: "auto",
                                                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                                                    padding: 2,
                                                },
                                            }}
                                        >
                                            {genres.map((genre) => (
                                                <Box
                                                    key={genre.id}
                                                    onClick={() => {
                                                        closeMenuGenres();
                                                        navigate(`/genres/${genre.name}`);
                                                    }}
                                                    sx={{
                                                        cursor: "pointer",
                                                        padding: 1.5,
                                                        textAlign: "center",
                                                        transition: "background-color 0.5s",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0, 0, 0, 0.08)",
                                                        },
                                                    }}
                                                >
                                                    <span>{genre.name}</span>
                                                </Box>
                                            ))}
                                        </Menu>
                                    </ListItem>
                                    <ListItem>
                                        <NavLink
                                            style={({ isActive, isPending, isTransitioning }) => {
                                                return {
                                                    fontWeight: isActive ? "bold" : "",
                                                    color: isActive
                                                        ? colors.greenAccent[500]
                                                        : colors.primary[100],
                                                    viewTransitionName: isTransitioning
                                                        ? "slide"
                                                        : "",
                                                    textDecoration: "none",
                                                    fontSize: "16px",
                                                    textDecorationLine: isActive
                                                        ? "underline"
                                                        : "none",
                                                    textDecorationColor: isActive
                                                        ? colors.greenAccent[500]
                                                        : "",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                };
                                            }}
                                            to="/series"
                                        >
                                            <LocalMoviesIcon fontSize={"large"} />
                                            Series
                                        </NavLink>
                                    </ListItem>
                                    <ListItem>
                                        <NavLink
                                            style={({ isActive, isPending, isTransitioning }) => {
                                                return {
                                                    fontWeight: isActive ? "bold" : "",
                                                    color: isActive
                                                        ? colors.greenAccent[500]
                                                        : colors.primary[100],
                                                    viewTransitionName: isTransitioning
                                                        ? "slide"
                                                        : "",
                                                    textDecoration: "none",
                                                    fontSize: 16,
                                                    textDecorationLine: isActive
                                                        ? "underline"
                                                        : "none",
                                                    textDecorationColor: isActive
                                                        ? colors.greenAccent[500]
                                                        : "",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                };
                                            }}
                                            to="/genres/NETFLIX"
                                        >
                                            <LiveTvIcon fontSize={"large"} />
                                            <span style={{ paddingTop: 2, paddingLeft: 2 }}>
                                                Netflix
                                            </span>
                                        </NavLink>
                                    </ListItem>
                                </List>
                            </Box>
                            <Box sx={{ display: "flex", placeItems: "center", columnGap: 1 }}>
                                <TextField
                                    placeholder="What are you going to watch today?"
                                    size="small"
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
                                        sx: { py: 0.5 },
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
                                <IconButton onClick={colorMode.toggleColorMode}>
                                    {theme.palette.mode === "dark" ? (
                                        <DarkModeOutlinedIcon />
                                    ) : (
                                        <LightModeOutlinedIcon />
                                    )}
                                </IconButton>
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
                                        >
                                            <PersonOutlinedIcon color="action" fontSize="medium" />
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                }}
                                            >
                                                {user?.userName}
                                            </span>
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
                                                My Profile
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
                                            onClick={function () {
                                                navigate("/login");
                                            }}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                columnGap: 1,
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            <LockOpenIcon />
                                            <Typography
                                                sx={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Sign In
                                            </Typography>
                                        </Button>
                                        <Button
                                            color="secondary"
                                            variant="outlined"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                columnGap: 1,
                                                px: 2,
                                                py: 1,
                                            }}
                                            onClick={function () {
                                                navigate("/register");
                                            }}
                                        >
                                            <AppRegistrationIcon />
                                            <Typography
                                                sx={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                Sign Up
                                            </Typography>
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                open={openDrawer}
                onClose={handleDrawerToggle}
                component={"aside"}
                PaperProps={{
                    sx: { width: "100vw", height: "100vh" },
                }}
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
                            <NavLink
                                style={({ isActive, isPending, isTransitioning }) => {
                                    return {
                                        fontWeight: isActive ? "bold" : "",
                                        color: isActive
                                            ? colors.greenAccent[500]
                                            : colors.primary[100],
                                        viewTransitionName: isTransitioning ? "slide" : "",
                                        textDecoration: "none",
                                        fontSize: "22px",
                                        textDecorationLine: isActive ? "underline" : "none",
                                        textDecorationColor: isActive
                                            ? colors.greenAccent[500]
                                            : "",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                        alignItems: "center",
                                    };
                                }}
                                to={"/"}
                                onClick={() => {
                                    setOpenDrawer(false);
                                }}
                            >
                                MovieLandia24
                            </NavLink>
                        </ListItem>
                        <ListItem>
                            <NavLink
                                style={({ isActive, isPending, isTransitioning }) => {
                                    return {
                                        fontWeight: isActive ? "bold" : "",
                                        color: isActive
                                            ? colors.greenAccent[500]
                                            : colors.primary[100],
                                        viewTransitionName: isTransitioning ? "slide" : "",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                        textDecorationLine: isActive ? "underline" : "none",
                                        textDecorationColor: isActive
                                            ? colors.greenAccent[500]
                                            : "",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                        alignItems: "center",
                                    };
                                }}
                                to="/movies"
                                onClick={() => {
                                    setOpenDrawer(false);
                                }}
                            >
                                <MovieIcon fontSize={"large"} />
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
                                    fontSize: 16,
                                    color: colors.primary[100],
                                    display: "flex",
                                    flexDirection: "row",
                                    columnGap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <SubtitlesIcon fontSize={"large"} />
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
                                            setOpenDrawer(false);
                                        }}
                                    >
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </ListItem>
                        <ListItem>
                            <NavLink
                                style={({ isActive, isPending, isTransitioning }) => {
                                    return {
                                        fontWeight: isActive ? "bold" : "",
                                        color: isActive
                                            ? colors.greenAccent[500]
                                            : colors.primary[100],
                                        viewTransitionName: isTransitioning ? "slide" : "",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                        textDecorationLine: isActive ? "underline" : "none",
                                        textDecorationColor: isActive
                                            ? colors.greenAccent[500]
                                            : "",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                        alignItems: "center",
                                    };
                                }}
                                to="/series"
                                onClick={() => {
                                    setOpenDrawer(false);
                                }}
                            >
                                <LocalMoviesIcon fontSize={"large"} />
                                Series
                            </NavLink>
                        </ListItem>
                        <ListItem>
                            <NavLink
                                style={({ isActive, isPending, isTransitioning }) => {
                                    return {
                                        fontWeight: isActive ? "bold" : "",
                                        color: isActive
                                            ? colors.greenAccent[500]
                                            : colors.primary[100],
                                        viewTransitionName: isTransitioning ? "slide" : "",
                                        textDecoration: "none",
                                        fontSize: "16px",
                                        textDecorationLine: isActive ? "underline" : "none",
                                        textDecorationColor: isActive
                                            ? colors.greenAccent[500]
                                            : "",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                        alignItems: "center",
                                    };
                                }}
                                to="/genres/NETFLIX"
                                onClick={() => {
                                    setOpenDrawer(false);
                                }}
                            >
                                <LiveTvIcon fontSize={"large"} />
                                <span style={{ paddingTop: 2, paddingLeft: 2 }}>Netflix</span>
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
                                placeholder="What are you going to watch today?"
                                value={searchParams.get("search") ? searchParams.get("search") : ""}
                                size="small"
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
                                    sx: {
                                        py: 0.5,
                                    },
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
                                    >
                                        <PersonOutlinedIcon color="action" fontSize="medium" />
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
                                            My Profile
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
                                <Stack flexDirection={"row"} columnGap={2}>
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
                                            px: 2,
                                            py: 1,
                                        }}
                                    >
                                        <LockOpenIcon />
                                        <Typography
                                            sx={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            Sign In
                                        </Typography>
                                    </Button>
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            columnGap: 1,
                                            px: 2,
                                            py: 1,
                                        }}
                                        onClick={function () {
                                            navigate("/register");
                                        }}
                                    >
                                        <AppRegistrationIcon />
                                        <Typography
                                            sx={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            Sign Up
                                        </Typography>
                                    </Button>
                                </Stack>
                            )}
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
