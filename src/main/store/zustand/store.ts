import create from "zustand";
import AppStoreState from "~/main/store/zustand/types/interfaceStore";

export const useStore = create<AppStoreState>(
  (set, get): AppStoreState => ({
    users: [],
    movies: [],
    searchTerm: "",
    user: null,
    userItem: null,
    genres: [],
    comments: [],
    favorites: [],
    latestMovies: [],
    setComments: (array) => {
      set({ comments: array });
    },
    setSearchTerm: (string) => {
      set({ searchTerm: string });
    },
    setGenres: (genres) => {
      set({ genres: genres });
    },
    setMovies: (movies) => {
      set({ movies: movies });
    },
    setUser: (data) => {
      set({ user: data });
    },
    setUserItem: (data) => {
      set({ userItem: data });
    },
    setFavorites: (favorites) => {
      set({ favorites: favorites });
    },
    setLatestMovies: (latestMovies) => {
      set({ latestMovies: latestMovies });
    },
  })
);
