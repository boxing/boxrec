import {BoxingBoutOutcome, BoxrecEventLinks} from "./event/boxrec.event.constants";
import {BoxrecProfileBoutLocation, BoxrecProfileBoxerBoutLinks} from "./profile/boxrec.profile.constants";

// used to get mocks from boxrec-mocks repo
export const boxRecMocksModulePath: string = "./node_modules/boxrec-mocks/pages/";

export interface Location {
    country: string | null;
    id: number | null;
    region: string | null;
    town: string | null;
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
    draw: number | null;
    loss: number | null;
    win: number | null;
}

export interface BoxrecBoutBasic {
    firstBoxerWeight: number | null;
    judges: BoxrecJudge[];
    links: BoxrecProfileBoxerBoutLinks | BoxrecEventLinks;
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
    links: BoxrecProfileBoxerBoutLinks;
    location: BoxrecProfileBoutLocation;
}

export type Stance = "orthodox" | "southpaw";
