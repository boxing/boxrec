import {BoxrecBasic, Location, Record, Stance, WinLossDraw} from "../boxrec.constants";

export interface BoxrecRatingsParams {
    division?: string;
    sex?: "M" | "F";
    status?: "a" | "";
}

export interface BoxrecRatingsParamsTransformed {
    "r[division]"?: string;
    "r[sex]"?: "M" | "F";
    "r[status]"?: "a" | "";
}

export interface BoxrecRating extends BoxrecBasic {
    points: number | null;
    rating: number | null;
    age: number | null;
    record: Record;
    last6: WinLossDraw[];
    stance: Stance | null;
    residence: Location;
    division: string | null;
}