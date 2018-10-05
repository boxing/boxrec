import {BoxrecBasic} from "../boxrec.constants";

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
    bio_open: number | null; // this is the wiki link
    bout: number | null;
    other: string[];
}

export enum Sport {
    proBoxing = "Pro Boxing",
    worldSeries = "World Series", // http://boxrec.com/en/event/775965
}
