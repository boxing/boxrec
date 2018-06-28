import {BoxingBoutOutcome, BoxrecEventLinks} from "./event/boxrec.event.constants";
import {BoxrecProfileBoutLinks, BoxrecProfileBoutLocation} from "./profile/boxrec.profile.constants";
import * as path from "path";

// used to get mocks from boxrec-mocks repo
export const boxRecMocksModulePath: string = "./node_modules/boxrec-mocks/pages/";

export interface Location {
    town: string | null;
    id: number | null;
    region: string | null;
    country: string | null;
}

export interface BoxrecBoutLocation {
    location: Location;
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
    win: number | null;
    loss: number | null;
    draw: number | null;
}

export interface BoxrecBoutBasic {
    judges: BoxrecJudge[];
    metadata: string;
    titles: BoxrecBasic[];
    rating: number | null;
    links: BoxrecProfileBoutLinks | BoxrecEventLinks;
    result: [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null];
    referee: BoxrecBasic;
    numberOfRounds: number;

    firstBoxerWeight: number | null;

    secondBoxer: BoxrecBasic;
    secondBoxerLast6: WinLossDraw[];
    secondBoxerRecord: Record;
    secondBoxerWeight: number | null;
}

export interface BoxrecBout extends BoxrecBoutBasic {
    date: string;
    location: BoxrecProfileBoutLocation;
    links: BoxrecProfileBoutLinks;
}

export type Stance = "orthodox" | "southpaw";
