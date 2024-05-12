import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import IMovie from "~/types/IMovie";
import Table from "~/components/admin/table/Table";

const MoviesAdmin = () => {
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<IMovie>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                accessorKey: "videoSrc",
                header: "VideoSrc",
            },
            {
                header: "TrailerSrc",
                accessorKey: "trailerSrc",
            },
            {
                header: "Duration",
                accessorKey: "duration",
            },
            {
                accessorKey: "ratingImdb",
                header: "RatingImdb",
            },
            {
                accessorKey: "releaseYear",
                header: "ReleaseYear",
            },
            {
                accessorKey: "description",
                header: "Description",
            },
            {
                accessorKey: "views",
                header: "Views",
            },
        ],
        [],
    );

    function handleAddMovie() {
        navigate("/admin/movies/add");
    }

    function handleDeleteMovie() {
        // navigate("/admin/movies/add");
    }

    const { table } = Table({
        columns,
        url: "",
        handleAddItem: handleAddMovie,
        handleDeleteItem: handleDeleteMovie,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Movies" subtitle="List of Movies" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default MoviesAdmin;
