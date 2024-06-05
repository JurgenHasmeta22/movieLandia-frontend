import { Box, SelectChangeEvent, Stack, Typography } from "@mui/material";
import SortSelect from "../sortSelect/SortSelect";

interface IReviews {
    data: any;
    sortBy: string;
    ascOrDesc: string;
    setFocusTarget: React.Dispatch<React.SetStateAction<"select" | "pagination" | null>>;
    selectRef: React.MutableRefObject<HTMLDivElement | null>;
    handleChangeSorting: (
        type: string,
        event: SelectChangeEvent,
        setFocusTarget: any,
        focusTargetType: string,
    ) => void;
}

export function Reviews({
    data,
    sortBy,
    ascOrDesc,
    handleChangeSorting,
    setFocusTarget,
    selectRef,
}: IReviews) {
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
                    onChange={(event) =>
                        handleChangeSorting("details", event, setFocusTarget, "select")
                    }
                    type="details"
                    ref={selectRef}
                />
            </Box>
        </Stack>
    );
}

export default Reviews;
