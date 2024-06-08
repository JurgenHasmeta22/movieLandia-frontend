import React from "react";
import { Stack, Pagination, Box, useTheme } from "@mui/material";
import { tokens } from "~/utils/theme";

interface IPaginationControl {
    pageCount: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationControl: React.FC<IPaginationControl> = ({ pageCount, currentPage, onPageChange }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box>
            <Stack spacing={2} sx={{ display: "flex", placeItems: "center", marginTop: 2, marginBottom: 4 }}>
                <Pagination
                    page={currentPage}
                    size="large"
                    count={pageCount}
                    showFirstButton
                    shape="rounded"
                    showLastButton
                    onChange={onPageChange}
                    sx={{
                        color: colors.primary[100],
                    }}
                />
            </Stack>
        </Box>
    );
};

export default PaginationControl;
