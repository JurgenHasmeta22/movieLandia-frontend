import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import IUser from "~/types/IUser";
import TableAdmin from "~/utils/TableAdmin";

const UsersAdmin = () => {
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: "id", header: "Id", enableHiding: true },
            {
                header: "Username",
                accessorKey: "userName",
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "password",
                header: "Password",
            },
        ],
        [],
    );

    function handleAddUser() {
        navigate("/admin/users/add");
    }

    function handleDeleteUser() {
        // navigate("/admin/users/add");
    }

    const { table } = TableAdmin({
        columns,
        page: "users",
        handleAddItem: handleAddUser,
        handleDeleteItem: handleDeleteUser,
    });

    return (
        <>
            {/* <SEOHelmet noIndex /> */}
            <Box m="20px" component={"main"}>
                <HeaderDashboard title="Users" subtitle="List of Users" />
                <MaterialReactTable table={table} />
            </Box>
        </>
    );
};

export default UsersAdmin;
