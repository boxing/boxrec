import {Location} from "@boxrec-constants";
import {WeightDivision} from "@boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecPageProfileBoxerBoutRow} from "@boxrec-pages/profile/boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileRole} from "@boxrec-pages/profile/boxrec.profile.constants";

export interface BoxrecProfileBoxerOutput {
    KOs: number | null;
    alias: string | null;
    birthName: string | null;
    birthPlace: Location | null;
    born: string | null;
    bouts: BoxrecPageProfileBoxerBoutRow[];
    debut: string | null;
    division: WeightDivision | null;
    globalId: number | null;
    hasBoutScheduled: boolean;
    height: number[] | null;
    name: string;
    nationality: string | null;
    numberOfBouts: number;
    otherInfo: string[][];
    picture: string;
    ranking: number[][] | null;
    rating: number | null;
    reach: number[] | null;
    residence: Location | null;
    role: BoxrecProfileRole[];
    rounds: number | null;
    stance: string | null;
    status: string | null;
    suspended: string | null;
    titlesHeld: string[] | null;
    vadacbp: boolean | null;
}