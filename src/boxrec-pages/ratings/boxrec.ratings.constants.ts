import {Country} from "boxrec-requests";
import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {WeightDivisionCapitalized} from "../titles/boxrec.page.title.constants";

export interface BoxrecRatingsParams {
    country?: Country | "";
    division?: WeightDivisionCapitalized;
    sex: "M" | "F"; // whatever reason this is necessary, figured it would default to Male but it does not
    stance?: "O" | "S"; // orthodox // southpaw // undefined is both
    status?: "a" | ""; // defaults to active/inactive
}

// abstract
interface BoxrecRatingsBasic {
    hasBoutScheduled: boolean;
    id: number | null;
    last6: WinLossDraw[];
    name: string | null;
    points: number | null;
    record: Record;
    residence: BoxrecLocation;
    stance: Stance | null;
}

// used for figuring out table column order
export type RatingsColumns =
    "name" | "points" | "rating" | "age" | "career" |
    "w-l-d" | "stance" | "residence" | "division" | "last 6" | "ranking";

export interface BoxrecPageRatingsActiveDivisionRowOutput extends BoxrecRatingsBasic {
    age: number | null;
    rating: number | null;
}

export interface BoxrecPageRatingsActiveInactiveDivisionRowOutput extends BoxrecRatingsBasic {
    career: number[];
}

export interface BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput
    extends BoxrecPageRatingsActiveInactiveDivisionRowOutput {
    division: WeightDivision | null;
}

export interface BoxrecPageRatingsActiveAllDivisionsRowOutput extends BoxrecPageRatingsActiveDivisionRowOutput {
    division: WeightDivision | null;
}

export interface BoxrecRatingsOutput {
    boxers: Array<BoxrecPageRatingsActiveAllDivisionsRowOutput | BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput
        | BoxrecPageRatingsActiveInactiveDivisionRowOutput | BoxrecPageRatingsActiveDivisionRowOutput>;
    numberOfPages: number;
}
