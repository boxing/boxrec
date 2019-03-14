import {BoxrecLocation} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";
import {BoxrecPageProfileOtherCommonBoutRow} from "./boxrec.page.profile.other.common.bout.row";
import {BoxrecProfileRole} from "./boxrec.profile.constants";

interface BoxrecProfileOutput {
    birthName: string | null;
    birthPlace: BoxrecLocation | null;
    globalId: number | null;
    name: string;
    otherInfo: string[][];
    picture: string;
    residence: BoxrecLocation | null;
    role: BoxrecProfileRole[];
    status: string | null;
}

export interface BoxrecProfileBoxerOutput extends BoxrecProfileOutput {
    KOs: number | null;
    alias: string | null;
    born: string | null;
    bouts: BoxrecPageProfileBoxerBoutRow[];
    debut: string | null;
    division: WeightDivision | null;
    hasBoutScheduled: boolean;
    height: number[] | null;
    nationality: string | null;
    numberOfBouts: number;
    ranking: number[][] | null;
    rating: number | null;
    reach: number[] | null;
    rounds: number | null;
    stance: string | null;
    suspended: string | null;
    titlesHeld: string[] | null;
    vadacbp: boolean | null;
}

export interface BoxrecProfileManagerOutput extends BoxrecProfileOutput {
    boxers: BoxrecPageProfileManagerBoxerRow[];
}

export interface BoxrecProfileOtherOutput extends BoxrecProfileOutput {
    bouts: BoxrecPageProfileOtherCommonBoutRow[];
}

export interface BoxrecProfilePromoterOutput extends BoxrecProfileEventsOutput {
    company: string | null;
}

export interface BoxrecProfileEventsOutput extends BoxrecProfileOutput {
    events: BoxrecPageProfileEventRow[];
}
