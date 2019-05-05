import {Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

export interface BoxrecWatchOutput {
    list: BoxrecPageWatchRowOutput[];
}

export interface BoxrecPageWatchRowOutput {
    alias: string | null;
    division: WeightDivision | null;
    globalId: number;
    last6: WinLossDraw[];
    name: string;
    record: Record;
    schedule: string | null; // date of their next bout
}
