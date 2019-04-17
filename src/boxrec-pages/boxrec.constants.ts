import {BoxrecGeneralLinks} from "../boxrec-common-tables/boxrec-common.constants";
import {BoxingBoutOutcome, BoxrecEventLinks} from "./event/boxrec.event.constants";
import {BoxrecProfileBoutLocation} from "./profile/boxrec.profile.constants";

interface BoxrecBasicLocation {
    id: string | number | null;
    name: string | null;
}

export interface BoxrecLocation {
    country: BoxrecBasicLocation;
    region: BoxrecBasicLocation;
    town: BoxrecBasicLocation;
}

export interface BoxrecBoutLocation {
    location: BoxrecLocation;
    venue: BoxrecBasic;
}

export enum WinLossDraw {
    win = "win",
    loss = "loss",
    draw = "draw",
    scheduled = "scheduled",
    unknown = "unknown", // not a boxrec thing, just for us in the rare case that a different outcome is found
}

export interface BoxrecBasic {
    id: number | null;
    name: string | null;
}

export interface BoxrecJudge extends BoxrecBasic {
    scorecard: number[];
}

export interface Record {
    draw: number | null;
    loss: number | null;
    win: number | null;
}

export interface BoxrecBoutBasic {
    firstBoxerWeight: number | null;
    judges: BoxrecJudge[];
    links: BoxrecGeneralLinks | BoxrecEventLinks;
    metadata: string;
    numberOfRounds: number;
    rating: number | null;
    referee: BoxrecBasic;
    result: [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null];
    secondBoxer: BoxrecBasic;
    secondBoxerLast6: WinLossDraw[];
    secondBoxerRecord: Record;
    secondBoxerWeight: number | null;
    titles: BoxrecBasic[];
}

export interface BoxrecBout extends BoxrecBoutBasic {
    date: string;
    links: BoxrecGeneralLinks;
    location: BoxrecProfileBoutLocation;
}

export type Stance = "orthodox" | "southpaw";
