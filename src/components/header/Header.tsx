import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useSearchParams, useLocation } from "react-router-dom";
import { useStore } from "~/store/store";
import type IGenre from "~/types/IGenre";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    Menu,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import { ColorModeContext, tokens } from "~/utils/theme";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Clear, Search } from "@mui/icons-material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useResizeWindow } from "~/hooks/useResizeWindow";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import genreService from "~/services/api/genreService";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import HeaderMenu from "../headerMenu/HeaderMenu";
import { useQuery } from "@tanstack/react-query";

const Header = (): React.JSX.Element => {
    // #region "State, refs, hooks, theme"
    const [options, setOptions] = useState<any>([]);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);

    const { user, setUser, isUserLoading, mobileOpen, setMobileOpen, setOpenDrawer } = useStore();

    const isPageShrunk = useResizeWindow();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { removeItem } = useLocalStorage("token");

    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // #endregion

    // #region "Event handlers"
    function handleLogout(): void {
        removeItem();
        setUser(null);
        closeMenuProfile();
        navigate("/login");
        window.scrollTo(0, 0);
    }

    function redirectToProfile(): void {
        navigate("/profile");
        window.scrollTo(0, 0);
    }

    const openMenuGenres = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorElGenres(event.currentTarget);
    };

    const closeMenuGenres = () => {
        setAnchorElGenres(null);
    };

    const openMenuProfile = (event: any) => {
        setAnchorElProfile(event.currentTarget);
    };

    const closeMenuProfile = () => {
        setAnchorElProfile(null);
    };
    // #endregion

    const genresQuery = useQuery({
        queryKey: ["genres"],
        queryFn: () => genreService.getGenres({}),
    });

    const genres: IGenre[] = genresQuery.data?.rows! ?? [];

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
            <AppBar position="fixed" component={"header"}>
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
                            columnGap={3}
                            flexWrap={"wrap"}
                        >
                            <Box>
                                <Link
                                    style={{
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        color: colors.primary[100],
                                        display: "flex",
                                        flexDirection: "row",
                                        columnGap: 1,
                                        alignItems: "center",
                                        fontSize: 20,
                                    }}
                                    to="/"
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    MovieLandia24
                                </Link>
                            </Box>
                            <Box>
                                <List sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                    <ListItem>
                                        <NavLink
                                            style={({ isActive, isTransitioning }) => {
                                                return {
                                                    fontWeight: isActive ? "bold" : "",
                                                    color: isActive ? colors.greenAccent[500] : colors.primary[100],
                                                    viewTransitionName: isTransitioning ? "slide" : "",
                                                    fontSize: "16px",
                                                    textDecorationLine: isActive ? "underline" : "none",
                                                    textDecorationColor: isActive ? colors.greenAccent[500] : "",
                                                    textDecorationThickness: "2px",
                                                    textUnderlineOffset: "4px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                };
                                            }}
                                            to="/movies"
                                            onClick={() => {
                                                window.scrollTo(0, 0);
                                            }}
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
                                        <NavLink
                                            style={({ isActive, isTransitioning }) => {
                                                return {
                                                    fontWeight: isActive ? "bold" : "",
                                                    color: isActive ? colors.greenAccent[500] : colors.primary[100],
                                                    viewTransitionName: isTransitioning ? "slide" : "",
                                                    fontSize: "16px",
                                                    textDecorationLine: isActive ? "underline" : "none",
                                                    textDecorationColor: isActive ? colors.greenAccent[500] : "",
                                                    textDecorationThickness: "2px",
                                                    textUnderlineOffset: "4px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                };
                                            }}
                                            to={"/genres"}
                                        >
                                            <SubtitlesIcon fontSize={"large"} />
                                            Genres
                                        </NavLink>
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
                                                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                                    padding: 3,
                                                },
                                            }}
                                        >
                                            {genres.map((genre) => (
                                                <Link
                                                    to={`/genres/${genre.name}`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: colors.primary[100],
                                                    }}
                                                >
                                                    <Box
                                                        key={genre.id}
                                                        onClick={() => {
                                                            closeMenuGenres();
                                                            window.scrollTo(0, 0);
                                                        }}
                                                        sx={{
                                                            cursor: "pointer",
                                                            padding: 1.5,
                                                            textAlign: "center",
                                                            transition: "background-color 0.2s",
                                                            "&:hover": {
                                                                backgroundColor: colors.greenAccent[800],
                                                            },
                                                        }}
                                                    >
                                                        <Typography component={"span"}>{genre.name}</Typography>
                                                    </Box>
                                                </Link>
                                            ))}
                                        </Menu>
                                    </ListItem>
                                    <ListItem>
                                        <NavLink
                                            style={({ isActive, isTransitioning }) => {
                                                return {
                                                    fontWeight: isActive ? "bold" : "",
                                                    color: isActive ? colors.greenAccent[500] : colors.primary[100],
                                                    viewTransitionName: isTransitioning ? "slide" : "",
                                                    textDecoration: "none",
                                                    fontSize: "16px",
                                                    textDecorationLine: isActive ? "underline" : "none",
                                                    textDecorationColor: isActive ? colors.greenAccent[500] : "",
                                                    textDecorationThickness: "2px",
                                                    textUnderlineOffset: "4px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    alignItems: "center",
                                                };
                                            }}
                                            to="/series"
                                            onClick={() => {
                                                window.scrollTo(0, 0);
                                            }}
                                        >
                                            <LocalMoviesIcon fontSize={"large"} />
                                            Series
                                        </NavLink>
                                    </ListItem>
                                </List>
                            </Box>
                            <Box sx={{ display: "flex", placeItems: "center", columnGap: 1 }}>
                                <TextField
                                    placeholder="What are you going to watch today?"
                                    size="small"
                                    value={searchParams.get("term") ? searchParams.get("term") : ""}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value.length > 0) {
                                            navigate(`/search?term=${value}`);
                                            window.scrollTo(0, 0);
                                        } else {
                                            navigate("/search");
                                            window.scrollTo(0, 0);
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
                                                        if (searchParams.get("term")) {
                                                            navigate("/search");
                                                            window.scrollTo(0, 0);
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
                                {isUserLoading && !user ? (
                                    <Skeleton variant="rectangular" width={223} />
                                ) : user && !isUserLoading ? (
                                    <Box width={"223px"} display={"flex"} justifyContent={"center"}>
                                        <IconButton
                                            id="buttonProfile"
                                            aria-controls={Boolean(anchorElProfile) ? "menuProfile" : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={Boolean(anchorElProfile) ? "true" : undefined}
                                            onClick={openMenuProfile}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "10px",
                                            }}
                                        >
                                            <PersonOutlinedIcon color="action" fontSize="medium" />
                                            <Typography
                                                component={"span"}
                                                style={{
                                                    fontSize: 16,
                                                }}
                                            >
                                                {user?.userName}
                                            </Typography>
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
                                            <MenuItem onClick={handleLogout} style={{ color: colors.primary[100] }}>
                                                Log Out
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                ) : (
                                    <Box display={"flex"} flexDirection={"row"} columnGap={1}>
                                        <Link
                                            to="/login"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <Button
                                                variant="text"
                                                onClick={function () {
                                                    window.scrollTo(0, 0);
                                                }}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    px: 2,
                                                    py: 1,
                                                    color: colors.primary[100],
                                                    "&:hover": {
                                                        backgroundColor: colors.greenAccent[700],
                                                        color: colors.grey[100],
                                                    },
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
                                        </Link>
                                        <Link
                                            to="/register"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <Button
                                                variant="text"
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    columnGap: 1,
                                                    px: 2,
                                                    py: 1,
                                                    color: colors.primary[100],
                                                    "&:hover": {
                                                        backgroundColor: colors.greenAccent[700],
                                                        color: colors.grey[100],
                                                    },
                                                }}
                                                onClick={function () {
                                                    window.scrollTo(0, 0);
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
                                        </Link>
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
            <HeaderMenu
                closeMenuGenres={closeMenuGenres}
                genres={genres}
                anchorElProfile={anchorElProfile}
                redirectToProfile={redirectToProfile}
                openMenuProfile={openMenuProfile}
                closeMenuProfile={closeMenuProfile}
                handleLogout={handleLogout}
            />
        </>
    );
};

export default Header;
