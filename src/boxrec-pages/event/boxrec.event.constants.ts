import {BoxrecBasic, BoxrecBoutLocation, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

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
    bouts: BoxrecEventBoutRowOutput[];
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

export interface BoxrecEventBoutRowOutput {
    division: WeightDivision | null;
    firstBoxer: BoxrecBasic;
    firstBoxerLast6: WinLossDraw[];
    firstBoxerRecord: Record;
    firstBoxerWeight: number | null;
    links: BoxrecEventLinks;
    metadata: string | null;
    numberOfRounds: Array<number | null>;
    outcome: WinLossDraw | null;
    outcomeByWayOf: string | null;
    rating: number | null;
    secondBoxer: BoxrecBasic;
    secondBoxerLast6: WinLossDraw[];
    secondBoxerRecord: Record;
    secondBoxerWeight: number | null;
}
