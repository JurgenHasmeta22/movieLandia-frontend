import { SelectChangeEvent } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export function useSorting() {
    const [searchParams, setSearchParams] = useSearchParams();

    function handleChangeSorting(event: SelectChangeEvent) {
        const selectedValue = event.target.value as string;

        if (selectedValue === "none") {
            if (searchParams.get("sortBy") && searchParams.get("ascOrDesc")) {
                searchParams.delete("sortBy");
                searchParams.delete("ascOrDesc");
                setSearchParams(searchParams);
            }
        } else {
            const [, sortByValue, ascOrDesc] = selectedValue.match(/(\w+)(Asc|Desc)/) || [];

            if (sortByValue && ascOrDesc) {
                searchParams.set("sortBy", sortByValue);
                searchParams.set("ascOrDesc", ascOrDesc.toLowerCase());
                setSearchParams(searchParams);
            }
        }
    }

    return handleChangeSorting;
}
