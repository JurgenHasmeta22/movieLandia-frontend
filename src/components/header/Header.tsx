import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import type IGenre from "~/interfaces/IGenre";
import movieService from "~/services/movieService";
import {
    AppBar,
    Box,
    Button,
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
import { Clear, Search } from "@mui/icons-material";

export const Header = (): React.JSX.Element => {
    const [options, setOptions] = useState<any>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user, setUser } = useStore();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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

    const handleGenreMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleGenreMouseLeave = () => {
        setAnchorEl(null);
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

    return (
        <AppBar position="static">
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
                            <img src="/assets/logos/ico_filma_blu.png" alt="" />
                            <NavLink
                                style={{
                                    textDecoration: "none",
                                    fontSize: "20px",
                                    paddingLeft: 8,
                                    color: colors.primary[100],
                                    cursor: "pointer",
                                }}
                                to="/movies"
                            >
                                Movies
                            </NavLink>
                        </ListItem>
                        <ListItem
                            onMouseEnter={handleGenreMouseEnter}
                            onMouseLeave={handleGenreMouseLeave}
                            // onClick={() => {
                            //     navigate(`/genres`);
                            // }}
                            sx={{ cursor: "pointer" }}
                        >
                            <img src="/assets/logos/ico_filma_blu.png" alt="" />
                            <Typography
                                style={{
                                    textDecoration: "none",
                                    fontSize: 20,
                                    color: colors.primary[100],
                                    paddingLeft: 8,
                                }}
                            >
                                Genres
                            </Typography>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleGenreMouseLeave}
                                MenuListProps={{
                                    onMouseLeave: handleGenreMouseLeave,
                                    style: { padding: 10 },
                                }}
                            >
                                {genres.map((genre) => (
                                    <MenuItem
                                        key={genre.id}
                                        onClick={() => {
                                            handleGenreMouseLeave();
                                            navigate(`/genres/${genre.name}`);
                                        }}
                                    >
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </ListItem>
                        <ListItem>
                            <img src="/assets/logos/ico_filma_blu.png" alt="" />
                            <NavLink
                                style={{
                                    textDecoration: "none",
                                    fontSize: "20px",
                                    paddingLeft: 8,
                                    color: colors.primary[100],
                                    cursor: "pointer",
                                }}
                                to="/series"
                            >
                                Series
                            </NavLink>
                        </ListItem>
                        <ListItem>
                            <img src="/assets/logos/netflix-red.png" alt="" />
                            <NavLink
                                style={{
                                    textDecoration: "none",
                                    fontSize: 20,
                                    paddingLeft: 8,
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
                        placeholder="Search for movies"
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
                            <Box
                                onClick={function () {
                                    redirectToProfile(user);
                                }}
                            >
                                <img src="/assets/avatars/blankavatar.jpg" />
                                {user.userName}
                            </Box>
                            <Box>
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    onClick={function (e: any) {
                                        handleLogout();
                                    }}
                                >
                                    <Typography>Log Out</Typography>
                                </Button>
                            </Box>
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
            </Toolbar>
        </AppBar>
    );
};
