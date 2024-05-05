import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useStore } from "~/store/zustand/store";
import type IGenre from "~/interfaces/IGenre";
import movieService from "~/services/movieService";
import { AppBar, Box, Button, List, ListItem, TextField, Typography } from "@mui/material";
import { Form } from "formik";

export const Header = (): React.JSX.Element => {
    const [options, setOptions] = useState<any>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const { user, setUser } = useStore();

    const navigate = useNavigate();
    const location = useLocation();

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
        <AppBar>
            <Box>
                <Link to="/movies">MovieLand24</Link>
                <List className="list-nav">
                    <ListItem className="div-inside-li">
                        <img src="/assets/logos/ico_filma_blu.png" alt="" />
                        <NavLink to="/movies" className="special-uppercase">
                            Movies
                        </NavLink>
                    </ListItem>
                    {/* <ListItem>
                        <Box>
                            <Box className="genre-drop">
                                <img src="/assets/logos/list_blu.png" alt="" />
                                <ListItem
                                    className="special-uppercase"
                                    onClick={function (e) {
                                        e.stopPropagation();
                                        navigate("/genres");
                                    }}
                                >
                                    Genres
                                </ListItem>
                            </Box>
                            <Box className="dropdown-content">
                                <List>
                                    {genres.map((genre: any) => (
                                        <ListItem
                                            className="special-list-drop"
                                            key={genre.id}
                                            onClick={function (e: any) {
                                                e.stopPropagation();
                                                navigate(`/genres/${genre.name}`);
                                            }}
                                        >
                                            {genre.name}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Box>
                    </ListItem> */}
                    <ListItem className="div-inside-li">
                        <img src="/assets/logos/netflix-red.png" alt="" />
                        <NavLink to="/genres/NETFLIX" className="special-uppercase">
                            Netflix
                        </NavLink>
                    </ListItem>
                </List>
            </Box>
            <Box>
                <form
                    className="button-search"
                    onSubmit={function (e) {
                        e.preventDefault();
                    }}
                >
                    <TextField
                        placeholder="Search for movies..."
                        onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
                            if (e.target.value.length > 0) {
                                setSearchTerm(e.target.value);
                                if (location.pathname !== "/movies") {
                                    navigate(`/movies?search=${searchTerm}`);
                                }
                            } else {
                                setSearchTerm(e.target.value);
                                if (location.pathname !== "/movies") navigate("/movies");
                            }
                        }}
                    />
                    <Button type="submit">
                        <i className="fa fa-search"></i>
                    </Button>
                </form>
                {user !== null ? (
                    <Box className="dropdown">
                        <ListItem
                            className="dropbtn"
                            onClick={function () {
                                redirectToProfile(user);
                            }}
                        >
                            <img src="/assets/avatars/blankavatar.jpg" />
                            {user.userName}
                        </ListItem>
                        <Box className="dropdown-content">
                            <Button
                                onClick={function (e: any) {
                                    e.stopPropagation();
                                    handleLogout();
                                }}
                            >
                                <Typography>Log Out</Typography>
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Button
                        onClick={function () {
                            navigate("/login");
                        }}
                    >
                        <i className="material-icons special-icon"></i>
                        Sign In
                    </Button>
                )}
            </Box>
        </AppBar>
    );
};
