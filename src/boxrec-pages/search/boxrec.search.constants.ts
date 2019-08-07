import {BoxrecFighterRole, BoxrecRole} from "boxrec-requests/dist/boxrec-requests.constants";
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
    sport: BoxrecFighterRole;
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

export interface BoxrecSearch extends BoxrecBasic {
    alias: string | null;
    career: Array<number | null>;
    division: string | null;
    id: number;
    last6: WinLossDraw[];
    record: Record;
    residence: BoxrecLocation;
    sport: BoxrecFighterRole;
}
