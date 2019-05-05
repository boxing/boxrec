import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {Country} from "../location/people/boxrec.location.people.constants";
import {WeightDivisionCapitalized} from "../titles/boxrec.page.title.constants";

export interface BoxrecRatingsParams {
    country?: Country | "";
    division?: WeightDivisionCapitalized;
    sex: "M" | "F"; // whatever reason this is necessary, figured it would default to Male but it does not
    stance?: "O" | "S"; // orthodox // southpaw // undefined is both
    status?: "a" | ""; // defaults to active/inactive
}

export interface BoxrecPageRatingsRowOutput {
    age: number | null;
    division: string | null;
    hasBoutScheduled: boolean | null;
    id: number | null;
    last6: WinLossDraw[];
    name: string | null;
    points: number | null;
    ranking: number | null;
    rating: number | null;
    record: Record;
    residence: BoxrecLocation;
    stance: Stance | null;
}

export interface BoxrecRatingsOutput {
    boxers: BoxrecPageRatingsRowOutput[];
    numberOfPages: number;
}
