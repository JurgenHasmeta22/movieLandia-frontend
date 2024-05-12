import { Box } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import IUser from "~/types/IUser";
import Table from "~/components/admin/table/Table";

const UsersAdmin = () => {
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<IUser>[]>(
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

    const { table } = Table({
        columns,
        url: "",
        handleAddItem: handleAddUser,
        handleDeleteItem: handleDeleteUser,
    });

    return (
        <Box m="20px">
            <HeaderDashboard title="Users" subtitle="List of Users" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default UsersAdmin;
