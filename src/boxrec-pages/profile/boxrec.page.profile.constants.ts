import {BoxrecGeneralLinks, BoxrecTitles} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxrecBasic, BoxrecJudge, BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxingBoutOutcome} from "../event/boxrec.event.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";
import {BoxrecPageProfileOtherCommonBoutRow} from "./boxrec.page.profile.other.common.bout.row";
import {BoxrecProfileBoutLocation, BoxrecProfileRole} from "./boxrec.profile.constants";

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

// boxer profile
export interface BoxrecProfileBoxerOutput extends BoxrecProfileOutput {
    KOs: number | null;
    alias: string | null;
    born: string | null;
    bouts: BoxrecProfileBoxerBoutOutput[];
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

// individual bout
export interface BoxrecProfileBoxerBoutOutput {
    date: string;
    firstBoxerRating: Array<number | null>;
    firstBoxerWeight: number | null;
    judges: BoxrecJudge[];
    links: BoxrecGeneralLinks;
    location: BoxrecProfileBoutLocation;
    metadata: string | null;
    numberOfRounds: Array<number | null>;
    outcome: WinLossDraw;
    rating: number | null;
    referee: BoxrecBasic;
    result: [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null];
    secondBoxer: BoxrecBasic;
    secondBoxerLast6: WinLossDraw[];
    secondBoxerRating: Array<number | null>;
    secondBoxerRecord: Record;
    secondBoxerWeight: number | null;
    titles: BoxrecTitles[];
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
