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
import IUser from "~/types/IUser";
import { useNavigate } from "react-router-dom";
import { Edit, Delete, Add } from "@mui/icons-material";
import movieService from "~/services/api/movieService";

const Movies = () => {
    const [movies, setMovies] = useState<IUser[]>([]);
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

    const columns = useMemo<MRT_ColumnDef<IUser>[]>(
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

    function handleAddUser() {
        navigate("/addUser");
    }

    async function getMovies(): Promise<void> {
        if (!movies.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        try {
            const response: IUser[] = await movieService.getMoviesDefault();
            setMovies(response);
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
        getMovies();
    }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);

    // #region React Material Table logic
    const table = useMaterialReactTable({
        columns,
        data: movies,
        // getRowId: (row) => row.userId,
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
            columnVisibility: { userId: false },
            showColumnFilters: true,
            showGlobalFilter: true,
            showLoadingOverlay: false,
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
            size: "medium",
            variant: "outlined",
        },
        muiPaginationProps: {
            color: "secondary",
            rowsPerPageOptions: [5, 10, 15, 20, 25, 30],
            shape: "rounded",
            size: "medium",
            variant: "outlined",
        },
        renderRowActionMenuItems: ({ closeMenu, row }) => [
            <MenuItem
                key={1}
                onClick={() => {
                    navigate(`/admin/movies/${row.original.id}`, {
                        state: {
                            userId: row.original.id,
                            from: "Movies",
                        },
                    });

                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                Edit
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={async () => {
                    // const response = await movieService.updateMovie(row.original, {
                    //     ...row.original,
                    //     userIsActive: false,
                    // });

                    // if (response) {
                    //     toast.success(CONSTANTS.UPDATE__SUCCESS);
                    //     getMovies();
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
                Delete
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
                    <Box>
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Button color="success" onClick={handleAddUser} variant="contained">
                                <Add />
                                Add
                            </Button>
                            <Button
                                color="error"
                                disabled={!table.getIsSomeRowsSelected()}
                                // onClick={handleDeleteUser}
                                variant="contained"
                            >
                                <Delete />
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Box>
            );
        },
    });
    // #endregion

    return (
        <Box m="20px">
            <HeaderDashboard title="Movies" subtitle="List of Movies" />
            <MaterialReactTable table={table} />
        </Box>
    );
};

export default Movies;
