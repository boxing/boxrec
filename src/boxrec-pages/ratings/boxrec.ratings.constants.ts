import {BoxrecBasic, Location, Record, Stance, WinLossDraw} from "../boxrec.constants";

export interface BoxrecRatingsParams {
    division?: string;
    sex?: "M" | "F";
    status?: "a" | "";
}

export interface BoxrecRatingsParamsTransformed {
    offset?: number;
    "r[division]"?: string;
    "r[sex]"?: "M" | "F";
    "r[status]"?: "a" | "";
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
