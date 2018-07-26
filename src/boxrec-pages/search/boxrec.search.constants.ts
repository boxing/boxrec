import {BoxrecBasic, Location, Record, WinLossDraw} from "../boxrec.constants";

export enum BoxrecStatus {
    active = "a",
    all = "", // active and inactive
}

export interface BoxrecSearchParams {
    first_name: string;
    last_name: string;
    role: BoxrecRole;
    status: BoxrecStatus;
}

export enum BoxrecRole {
    all = "all", // just used for search
    boxer = "boxer",
    doctor = "doctor",
    inspector = "inspector",
    judge = "judge",
    manager = "manager",
    matchmaker = "matchmaker",
    promoter = "promoter",
    referee = "referee",
    supervisor = "supervisor",
}

/**
 * The search params to BoxRec are in an array
 */
export interface BoxrecSearchParamsTransformed {
    "offset"?: number;
    "pf[first_name]"?: string;
    "pf[last_name]"?: string;
    "pf[role]"?: BoxrecRole;
    "pf[status]"?: BoxrecStatus;
}

export interface BoxrecSearch extends BoxrecBasic {
    alias: string | null;
    career: (number | null)[];
    division: string | null;
    id: number;
    last6: WinLossDraw[];
    record: Record;
    residence: Location;
}

export interface BoxrecSearchMetadata {
    location: {
        address: BoxrecSearchLocation;
    };
    startDate: string | null;

    [key: string]: any;
}

export interface BoxrecSearchLocation {
    addressCountry: string | null;
    addressLocality: string | null;
    addressRegion: string | null;
    streetAddress: string | null;
}