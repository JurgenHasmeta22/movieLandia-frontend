import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import IGenre from "~/types/IGenre";
import Table from "~/components/admin/table/Table";

const GenresAdmin = () => {
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<IGenre>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Name",
                accessorKey: "name",
            },
        ],
        [],
    );

    function handleAddGenre() {
        navigate("/admin/genres/add");
    }

    function handleDeleteGenre() {
        navigate("/admin/genres/add");
    }

    const { table } = Table({
        columns,
        url: "",
        handleAddItem: handleAddGenre,
        handleDeleteItem: handleDeleteGenre,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Genres" subtitle="List of Genres" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenresAdmin;
