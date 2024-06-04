import { Stack, Pagination } from "@mui/material";

interface IPaginationControl {
    pageCount: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationControl = ({ pageCount, currentPage, onPageChange }: IPaginationControl) => (
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
);

export default PaginationControl;
