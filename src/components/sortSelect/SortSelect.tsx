import React from "react";
import { Box, MenuItem, Select, SelectChangeEvent, SvgIcon } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { toFirstWordUpperCase } from "~/utils/utils";

const valueToLabelMap: Record<string, string> = {
    none: "None",
    ratingImdbAsc: "Imdb rating (Asc)",
    ratingImdbDesc: "Imdb rating (Desc)",
    titleAsc: "Title (Asc)",
    titleDesc: "Title (Desc)",
};

interface SortSelectProps {
    sortBy: string | null;
    ascOrDesc: string | null;
    onChange: (event: SelectChangeEvent<string>) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ sortBy, ascOrDesc, onChange }) => {
    return (
        <Select
            defaultValue="none"
            value={sortBy && ascOrDesc ? sortBy + toFirstWordUpperCase(ascOrDesc) : "none"}
            onChange={onChange}
            sx={{
                px: 2,
            }}
            renderValue={(value: string) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <SvgIcon color="secondary">
                        <SwapVertIcon />
                    </SvgIcon>
                    {valueToLabelMap[value]}
                </Box>
            )}
        >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="ratingImdbAsc">Imdb rating (Asc)</MenuItem>
            <MenuItem value="ratingImdbDesc">Imdb rating (Desc)</MenuItem>
            <MenuItem value="titleAsc">Title (Asc)</MenuItem>
            <MenuItem value="titleDesc">Title (Desc)</MenuItem>
        </Select>
    );
};

export default SortSelect;
