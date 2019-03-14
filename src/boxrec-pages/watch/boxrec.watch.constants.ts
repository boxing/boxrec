import {WinLossDraw} from "../boxrec.constants";
import {BoxrecPageWatchRow} from "./boxrec.page.watch.row";

export interface BoxrecBoxerWatch {
    alias: string;
    division: string;
    last6: WinLossDraw[];
    name: string;
    schedule: string; // date of their next bout
}

export interface BoxrecWatchOutput {
    list: BoxrecPageWatchRow[];
}
