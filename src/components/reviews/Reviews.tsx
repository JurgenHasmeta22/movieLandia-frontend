import { Box, SelectChangeEvent, Stack, Typography } from "@mui/material";
import SortSelect from "../sortSelect/SortSelect";

interface IReviews {
    data: any;
    sortBy: string;
    ascOrDesc: string;
    handleChangeSorting: (type: string, event: SelectChangeEvent) => void;
}

export function Reviews({ data, sortBy, ascOrDesc, handleChangeSorting }: IReviews) {
    return (
        <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Box>
                <Typography fontSize={28} color={"secondary"} textAlign={"center"}>
                    Reviews ({data.totalReviews})
                </Typography>
            </Box>
            <Box>
                <SortSelect
                    sortBy={sortBy}
                    ascOrDesc={ascOrDesc}
                    onChange={(event) => handleChangeSorting("details", event)}
                    type="details"
                />
            </Box>
        </Stack>
    );
}

export default Reviews;
