import type IEpisode from "./IEpisode";

export default interface ISerie {
    id?: number;
    title: string;
    photoSrc: string;
    releaseYear: number;
    ratingImdb: number;
    episodes: IEpisode[];
}
