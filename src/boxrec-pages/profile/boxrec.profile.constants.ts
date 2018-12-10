import {BoxrecBout} from "../boxrec.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";

export interface BoxrecProfile {
    KOs: number | null;
    alias: string | null;
    birthName: string | null;
    birthPlace: string | null;
    born: string | null;
    bouts: BoxrecBout[];
    debut: string | null;
    division: string | null;
    globalId: number | null;
    hasBoutScheduled: boolean;
    height: number[] | null;
    name: string | null;
    nationality: string | null;
    numberOfBouts: number;
    otherInfo: string[][] | null;
    ranking: number[][] | null;
    rating: number | null;
    reach: number[] | null;
    residence: string | null;
    role: string | null;
    rounds: number | null;
    stance: string | null;
    status: string | null;
    suspended: string | null;
    titlesHeld: string[] | null;
    vadacbp: string | null;
}

export enum BoxrecProfileTable {
    globalId = "global ID",
    role = "role",
    rating = "rating",
    ranking = "ranking",
    vadacbp = "VADA CBP",
    bouts = "bouts",
    rounds = "rounds",
    KOs = "KOs",
    status = "status",
    titlesHeld = "titles held",
    birthName = "birth name",
    alias = "alias",
    born = "born",
    nationality = "nationality",
    debut = "debut",
    division = "division",
    stance = "stance",
    height = "height",
    reach = "reach",
    residence = "residence",
    birthPlace = "birth place",
    company = "company",
    registeredContact = "registered contact",
}

export interface BoxrecProfileBoutLocation {
    town: string | null;
    venue: string | null;
}

export interface BoxrecProfileBoutLinks {
    bio_open: number | null;  // this is the wiki link
    bout: number | null;
    event: number | null;
    other: string[];
}

export interface PersonRequestParams {
    offset?: number;
    pdf?: "y";
    print?: "y";
    toggleRatings?: "y"; // hard coded but this value doesn't actually matter to BoxRec
}

export interface BoxrecProfileRole {
    id: number | null;
    name: BoxrecRole;
}
