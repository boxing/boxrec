import {Location} from "@boxrec-constants";
import {WeightDivision} from "@boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecPageProfileBoxerBoutRow} from "@boxrec-pages/profile/boxrec.page.profile.boxer.bout.row";
import {BoxrecPageProfileManagerBoxerRow} from "@boxrec-pages/profile/boxrec.page.profile.manager.boxer.row";
import {BoxrecProfileRole} from "@boxrec-pages/profile/boxrec.profile.constants";

interface BoxrecProfileOutput {
    birthName: string | null;
    birthPlace: Location | null;
    globalId: number | null;
    name: string;
    otherInfo: string[][];
    picture: string;
    residence: Location | null;
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
