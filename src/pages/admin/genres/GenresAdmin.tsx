import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import IGenre from "~/types/IGenre";
import TableAdmin from "~/utils/TableAdmin";

const GenresAdmin = () => {
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
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

    const { table } = TableAdmin({
        columns,
        page: "genres",
        handleAddItem: handleAddGenre,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Genres" subtitle="List of Genres" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenresAdmin;
