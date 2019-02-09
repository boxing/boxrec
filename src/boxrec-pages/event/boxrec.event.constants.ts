import {BoxrecBasic, BoxrecBoutLocation} from "@boxrec-constants";
import {BoxrecPageEventBoutRow} from "@boxrec-pages/event/boxrec.page.event.bout.row";

export interface BoxrecPromoter extends BoxrecBasic {
    company: string | null;
}

export enum BoxingBoutOutcome {
    TKO = "technical knockout",
    KO = "knockout",
    UD = "unanimous decision",
    MD = "majority decision",
    SD = "split decision",
    TD = "technical decision",
    RTD = "corner retirement",
    DQ = "disqualification",
    NWS = "newspaper decision",
}

export interface BoxrecEventLinks {
    bio: number | null; // this is the wiki link
    bout: number | null;
    other: string[];
}

export interface BoxrecEventOutput {
    bouts: BoxrecPageEventBoutRow[];
    commission: string | null;
    date: string | null;
    doctors: BoxrecBasic[];
    id: number | null;
    inspector: BoxrecBasic;
    location: BoxrecBoutLocation;
    matchmakers: BoxrecBasic[];
    numberOfBouts: number;
    promoters: BoxrecPromoter[];
    television: string[];
}
