import { BiHome, BiUser, BiCameraMovie, BiVideo, BiTv } from "react-icons/bi";

export const sidebarItems = [
    {
        label: "Dashboard",
        to: "/admin/dashboard",
        icon: <BiHome />,
        index: 0,
    },
    {
        label: "Users",
        to: "/admin/users",
        icon: <BiUser />,
        index: 1,
    },
    {
        label: "Movies",
        to: "/admin/movies",
        icon: <BiCameraMovie />,
        index: 2,
    },
    {
        label: "Genres",
        to: "/admin/genres",
        icon: <BiVideo />,
        index: 3,
    },
    {
        label: "Series",
        to: "/admin/series",
        icon: <BiTv />,
        index: 4,
    },
];
