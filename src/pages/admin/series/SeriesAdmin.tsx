import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TableAdmin from "~/utils/TableAdmin";

const SeriesAdmin = () => {
    const navigate = useNavigate();

    const columns = useMemo<MRT_ColumnDef<any>[]>(
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

    const { table } = TableAdmin({
        columns,
        page: "series",
        handleAddItem: handleAddSerie,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Series" subtitle="List of Series" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default SeriesAdmin;
