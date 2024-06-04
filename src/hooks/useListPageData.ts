import { useSearchParams } from "react-router-dom";
import { useSorting } from "./useSorting";

export function useListPageData() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();

    const page = searchParams.get("page") || 1;
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const ascOrDesc = searchParams.get("ascOrDesc");

    return {
        searchParams,
        setSearchParams,
        handleChangeSorting,
        page,
        search,
        sortBy,
        ascOrDesc
    };
}
