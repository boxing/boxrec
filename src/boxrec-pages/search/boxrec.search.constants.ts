import {BoxrecBasic, BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

export enum BoxrecStatus {
    active = "a",
    all = "", // active and inactive
}

export interface BoxrecPageSearchRowOutput {
    alias: string | null;
    career: Array<number | null>;
    division: WeightDivision | null;
    id: number;
    last6: WinLossDraw[];
    name: string | null;
    record: Record;
    residence: BoxrecLocation;
}

export interface BoxrecPageSearchOutput {
    results: BoxrecPageSearchRowOutput[];
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

export interface BoxrecSearch extends BoxrecBasic {
    alias: string | null;
    career: Array<number | null>;
    division: string | null;
    id: number;
    last6: WinLossDraw[];
    record: Record;
    residence: BoxrecLocation;
}
