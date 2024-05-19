import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    MRT_ColumnDef,
    MRT_ColumnFiltersState,
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_SortingState,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    useMaterialReactTable,
} from "material-react-table";
import {
    Box,
    Button,
    IconButton,
    ListItemIcon,
    MenuItem,
    Tooltip,
    Typography,
} from "@mui/material";
import { Edit, Delete, Add, CheckOutlined, WarningOutlined } from "@mui/icons-material";
import serieService from "~/services/api/serieService";
import movieService from "~/services/api/movieService";
import userService from "~/services/api/userService";
import genreService from "~/services/api/genreService";
import { toFirstWordUpperCase } from "./utils";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FormikProps } from "formik";
import { useModal } from "~/services/providers/ModalContext";
import * as CONSTANTS from "~/constants/Constants";

type props = {
    columns: MRT_ColumnDef<any>[];
    page: string;
    handleAddItem: () => void;
    handleDeleteItem: () => void;
};

const TableAdmin = ({ columns, page, handleAddItem, handleDeleteItem }: props) => {
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
        pageSize: 10,
    });
    const navigate = useNavigate();
    const { openModal } = useModal();
    // const formikRef = useRef<FormikProps<any>>(null);
    const [open, setOpen] = useState(false);

    // console.log(
    //     rowSelection,
    //     isError,
    //     isLoading,
    //     setIsLoading,
    //     isRefetching,
    //     columnFilters,
    //     globalFilter,
    //     sorting,
    //     pagination,
    // );

    function handleMassiveDeleteMovies() {
        const keysArray = Object.keys(rowSelection);

        openModal({
            onClose: () => setOpen(false),
            title: `Delete selected ${page}`,
            actions: [
                {
                    label: CONSTANTS.MODAL__DELETE__NO,
                    onClick: () => setOpen(false),
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#ff5252",
                    },
                    icon: <WarningOutlined />,
                },
                {
                    label: CONSTANTS.MODAL__DELETE__YES,
                    onClick: () => {},
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#30969f",
                    },
                    icon: <CheckOutlined />,
                },
            ],
            subTitle: "Do you want to delete selected rows ?",
        });
    }

    const fetchData = async () => {
        if (!rows.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        try {
            let response: any;

            const queryParams = {
                page: String(pagination.pageIndex + 1),
                pageSize: String(pagination.pageSize),
            };

            switch (page) {
                case "series":
                    response = await serieService.getSeries(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "movies":
                    response = await movieService.getMovies(queryParams);
                    setRows(response.movies);
                    setRowsCount(response.count);
                    break;
                case "genres":
                    response = await genreService.getGenres(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "users":
                    response = await userService.getUsers(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                default:
                    response = { rows: [], count: 0 };
            }
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
        rowCount: rowsCount,
        getRowId: (row) => String(row.id),
        enableColumnOrdering: true,
        enableRowSelection: true,
        enableFullScreenToggle: true,
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
            isFullScreen: false,
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
        state: {
            rowSelection,
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
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
                    navigate(`/admin/${page}/${row.original.id}`, {
                        state: {
                            from: toFirstWordUpperCase(page),
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
                    handleDeleteItem();
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
                        <Tooltip arrow title="Refresh Data">
                            <IconButton
                                onClick={() => {
                                    // refetch()
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                        <MRT_ToggleFullScreenButton table={table} />
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
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Add
                            </Typography>
                        </Button>
                        <Button
                            color="error"
                            disabled={!table.getIsSomeRowsSelected()}
                            onClick={() => {
                                handleMassiveDeleteMovies();
                            }}
                            variant="contained"
                        >
                            <Delete />
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Delete
                            </Typography>
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

export default TableAdmin;
