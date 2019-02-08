import {WinLossDraw} from "@boxrec-constants";

export interface BoxrecBoxerWatch {
    alias: string;
    division: string;
    last6: WinLossDraw[];
    name: string;
    schedule: string; // date of their next bout
}