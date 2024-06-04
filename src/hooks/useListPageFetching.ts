import movieService from "~/services/api/movieService";
import serieService from "~/services/api/serieService";

export function useListPageFetching({ search, type, page, sortBy, ascOrDesc }: any) {
    const fetchListData = async () => {
        let response;
        const queryParams: Record<string, string | number> = { page };

        if (search) {
            if (type === "series") {
                response = await serieService.searchSeriesByTitle(search, String(page));
            } else if (type === "movies") {
                response = await movieService.searchMoviesByTitle(search, String(page));
            }
        } else {
            if (sortBy) {
                queryParams.sortBy = sortBy;
            }

            if (ascOrDesc) {
                queryParams.ascOrDesc = ascOrDesc;
            }

            if (type === "series") {
                response = await serieService.getSeries(queryParams);
            } else if (type === "movies") {
                response = await movieService.getMovies(queryParams);
            }
        }

        return response;
    };

    return {
        fetchListData,
    };
}
