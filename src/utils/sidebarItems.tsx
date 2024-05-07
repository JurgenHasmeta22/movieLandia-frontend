import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export const sidebarItems = [
    {
        label: "Dashboard",
        to: "/admin/dashboard",
        icon: <HomeOutlinedIcon />,
        index: 0,
    },
    {
        label: "Users",
        to: "/admin/users",
        icon: <PeopleOutlinedIcon />,
        index: 1,
    },
    {
        label: "Movies",
        to: "/admin/movies",
        icon: <ReceiptOutlinedIcon />,
        index: 2,
    },
    {
        label: "Genres",
        to: "/admin/genres",
        icon: <PersonOutlinedIcon />,
        index: 3,
    },
    {
        label: "Series",
        to: "/admin/series",
        icon: <PersonOutlinedIcon />,
        index: 4,
    },
];
