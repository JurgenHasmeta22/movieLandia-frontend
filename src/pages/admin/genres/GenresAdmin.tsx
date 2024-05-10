import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ColumnFiltersState,
    MRT_PaginationState,
    MRT_SortingState,
} from "material-react-table";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Add } from "@mui/icons-material";
import movieService from "~/services/api/movieService";
import IGenre from "~/types/IGenre";

const GenresAdmin = () => {
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [rowSelection, setRowSelection] = useState<any>({});
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
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

    async function getGenres(): Promise<void> {
        if (!genres.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        try {
            const response: IGenre[] = await movieService.getGenresWithNoPagination();
            setGenres(response);
        } catch (error) {
            setIsError(true);
            console.error(error);
            return;
        }

        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    }

    useEffect(() => {
        getGenres();
    }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);

    // #region React Material Table logic
    const table = useMaterialReactTable({
        columns,
        data: genres,
        getRowId: (row) => String(row.id),
        enableColumnOrdering: true,
        enableRowSelection: true,
        enablePagination: true,
        enableRowActions: true,
        enablePinning: true,
        enableSortingRemoval: true,
        enableColumnFilterModes: true,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableClickToCopy: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                  color: "error",
                  children: "Error loading data",
              }
            : undefined,
        initialState: {
            columnVisibility: { id: false },
            showColumnFilters: false,
            showGlobalFilter: true,
            showLoadingOverlay: false,
            density: "compact",
            columnPinning: {
                left: ["mrt-row-expand", "mrt-row-select"],
                right: ["mrt-row-actions"],
            },
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        state: { rowSelection },
        paginationDisplayMode: "pages",
        positionToolbarAlertBanner: "bottom",
        muiSearchTextFieldProps: {
            size: "small",
            variant: "outlined",
        },
        muiTablePaperProps: {
            style: {
                padding: 18,
            },
        },
        // muiTableBodyRowProps: {

        // },
        muiPaginationProps: {
            color: "secondary",
            rowsPerPageOptions: [5, 10, 15, 20],
            shape: "rounded",
            size: "small",
            variant: "outlined",
            style: {
                paddingTop: 6,
            },
        },
        renderRowActionMenuItems: ({ closeMenu, row }) => [
            <MenuItem
                key={1}
                onClick={() => {
                    navigate(`/admin/genres/${row.original.id}`, {
                        state: {
                            userId: row.original.id,
                            from: "Genres",
                        },
                    });

                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <Typography>Edit</Typography>
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={async () => {
                    // const response = await movieService.updateGenre(row.original, {
                    //     ...row.original,
                    //     userIsActive: false,
                    // });

                    // if (response) {
                    //     toast.success(CONSTANTS.UPDATE__SUCCESS);
                    //     getGenres();
                    // } else {
                    //     toast.error(CONSTANTS.UPDATE__FAILURE);
                    // }

                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Delete />
                </ListItemIcon>
                <Typography>Delete</Typography>
            </MenuItem>,
        ],
        renderTopToolbar: ({ table }) => {
            return (
                <Box
                    sx={() => ({
                        display: "flex",
                        gap: "1rem",
                        p: "10px",
                        justifyContent: "space-between",
                    })}
                >
                    <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            placeItems: "center",
                            placeContent: "center",
                            gap: "1rem",
                        }}
                    >
                        <Button color="success" onClick={handleAddGenre} variant="contained">
                            <Add />
                            <Typography>Add</Typography>
                        </Button>
                        <Button
                            color="error"
                            disabled={!table.getIsSomeRowsSelected()}
                            // onClick={handleDeleteUser}
                            variant="contained"
                        >
                            <Delete />
                            <Typography>Delete</Typography>
                        </Button>
                    </Box>
                </Box>
            );
        },
    });
    // #endregion

    return (
        <Box m="20px">
            <HeaderDashboard title="Genres" subtitle="List of Genres" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default GenresAdmin;
