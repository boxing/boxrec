import {BoxrecBasic, WinLossDraw} from "@boxrec-constants";
import {BoxingBoutOutcome} from "../boxrec.event.constants";

export interface BoutPageLast6 extends BoutPageOutcome {
    date: string | null;
    id: number | null;
    name: string | null;
}

export interface BoutPageOutcome {
    outcome: WinLossDraw | null;
    outcomeByWayOf: BoxingBoutOutcome | null;
}

export interface BoutPageBoutOutcome extends BoutPageOutcome {
    boxer: BoxrecBasic;
}
