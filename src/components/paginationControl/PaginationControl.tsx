import React, { forwardRef } from "react";
import { Stack, Pagination, Box } from "@mui/material";

interface IPaginationControl {
    pageCount: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationControl = forwardRef<HTMLDivElement, IPaginationControl>(
    ({ pageCount, currentPage, onPageChange }, ref) => (
        <Box ref={ref} tabIndex={-1}>
            <Stack
                spacing={2}
                sx={{ display: "flex", placeItems: "center", marginTop: 2, marginBottom: 4 }}
            >
                <Pagination
                    page={currentPage}
                    size="large"
                    count={pageCount}
                    showFirstButton
                    showLastButton
                    onChange={onPageChange}
                    color="secondary"
                />
            </Stack>
        </Box>
    ),
);

PaginationControl.displayName = "PaginationControl";

export default PaginationControl;
