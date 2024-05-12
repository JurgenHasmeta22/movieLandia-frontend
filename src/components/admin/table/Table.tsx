import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    MRT_ColumnFiltersState,
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_SortingState,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    useMaterialReactTable,
} from "material-react-table";
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import serieService from "~/services/api/serieService";

const Table = ({ columns, url, handleAddItem, handleDeleteItem }: any) => {
    const [rows, setRows] = useState<any[]>([]);
    const [rowsCount, setRowsCount] = useState<number>(0);
    const [rowSelection, setRowSelection] = useState<any>({});
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!rows.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        try {
            const response = await serieService.getSeries({});
            setRows(response.rows);
            setRowsCount(response.count);
        } catch (error) {
            setIsError(true);
            console.error(error);
        }

        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect(() => {
        fetchData();
    }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);

    const table = useMaterialReactTable({
        columns,
        data: rows,
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
                key={0}
                onClick={() => {
                    navigate(`/admin/series/${row.original.id}`, {
                        state: {
                            userId: row.original.id,
                            from: "Series",
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
                        <Button color="success" onClick={handleAddItem} variant="contained">
                            <Add />
                            <Typography>Add</Typography>
                        </Button>
                        <Button
                            color="error"
                            disabled={!table.getIsSomeRowsSelected()}
                            onClick={handleDeleteItem}
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

    return {
        table,
    };
};

export default Table;
