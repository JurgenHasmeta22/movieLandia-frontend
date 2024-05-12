import { Box } from "@mui/material";
import {
    MaterialReactTable,
    type MRT_ColumnDef,
} from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ISerie from "~/types/ISerie";
import Table from "~/components/admin/table/Table";

const SeriesAdmin = () => {
    const navigate = useNavigate();

    const columns = useMemo<MRT_ColumnDef<ISerie>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                accessorKey: "ratingImdb",
                header: "RatingImdb",
            },
            {
                accessorKey: "releaseYear",
                header: "ReleaseYear",
            },
        ],
        [],
    );

    function handleAddSerie() {
        navigate("/admin/series/add");
    }

    function handleDeleteSerie() {
        // navigate("/admin/series/add");
    }

    const { table } = Table({
        columns,
        url: "",
        handleAddItem: handleAddSerie,
        handleDeleteItem: handleDeleteSerie,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Series" subtitle="List of Series" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default SeriesAdmin;
