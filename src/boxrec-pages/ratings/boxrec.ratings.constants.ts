import {BoxrecBasic, Location, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {Country} from "../location/people/boxrec.location.people.constants";
import {WeightDivisionCapitalized} from "../titles/boxrec.page.title.constants";

export interface BoxrecRatingsParams {
    country?: Country | "";
    division?: WeightDivisionCapitalized;
    sex: "M" | "F"; // whatever reason this is necessary, figured it would default to Male but it does not
    stance?: "O" | "S"; // orthodox // southpaw // undefined is both
    status?: "a" | ""; // defaults to active/inactive
}

export interface BoxrecRating extends BoxrecBasic {
    age: number | null;
    division: string | null;
    last6: WinLossDraw[];
    points: number | null;
    rating: number | null;
    record: Record;
    residence: Location;
    stance: Stance | null;
}
