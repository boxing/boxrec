import {BoxrecBout} from "../boxrec.constants";

export interface BoxrecProfile {
    name: string | null;
    globalId: number | null;
    role: string | null;
    rating: number | null;
    ranking: number[][] | null;
    vadacbp: string | null;
    numberOfBouts: number;
    rounds: number | null;
    KOs: number | null;
    status: string | null;
    titlesHeld: string[] | null;
    birthName: string | null;
    alias: string | null;
    born: string | null;
    nationality: string | null;
    debut: string | null;
    division: string | null;
    height: number[] | null;
    reach: number[] | null;
    residence: string | null;
    birthPlace: string | null;
    stance: string | null;
    otherInfo: string[][] | null;
    bouts: BoxrecBout[];
    hasBoutScheduled: boolean;
    suspended: string | null;
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
}

export interface BoxrecProfileBoutLocation {
    venue: string | null;
    town: string | null;
}

export interface BoxrecProfileBoutLinks {
    bio_open: number | null;  // this is the wiki link
    bout: number | null;
    event: number | null;
    other: string[];
}