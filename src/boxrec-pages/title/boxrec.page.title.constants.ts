import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";

export interface BoxrecTitleOutput {
    bouts: BoxrecPageTitleRowOutput[];
    champion: BoxrecBasic;
    name: string;
    numberOfBouts: number;
}

export interface BoxrecPageTitleRowOutput {
    date: string;
    firstBoxer: BoxrecBasic;
    firstBoxerWeight: number | null;
    links: BoxrecGeneralLinks;
    location: BoxrecLocation;
    metadata: string | null;
    numberOfRounds: number[];
    outcome: WinLossDraw;
    rating: number | null;
    secondBoxer: BoxrecBasic;
    secondBoxerWeight: number | null;
}
