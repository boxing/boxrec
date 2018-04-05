// used to get mocks from boxrec-mocks repo
export const boxRecMocksModulePath = "./node_modules/boxrec-mocks/pages/";

export enum boxrecProfileTable {
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
    suspensions: BoxrecSuspension[];
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
    win: number;
    loss: number;
    draw: number;
}

export interface BoxrecId {
    id: string | null;
    name: string | null;
}

export interface BoxrecBout {
    date: string;
    firstBoxerWeight: number | null;
    secondBoxerWeight: number | null;
    opponent: BoxrecBasic | null;
    opponentLast6: WinLossDraw[];
    opponentRecord: Record;
    referee: BoxrecBasic;
    judges: BoxrecJudge[];
    metadata: string;
    titles: BoxrecId[];
    rating: number | null;
    location: BoxrecBoutLocation;
    links: Object;
    result: [WinLossDraw, BoxingBoutOutcome | string, BoxingBoutOutcome | string];
}

export enum BoxingBoutOutcome {
    TKO = "technical knockout",
    KO = "knockout",
    UD = "unanimous decision",
    MD = "majority decision",
    SD = "split decision",
    TD = "technical decision",
    RTD = "corner retirement",
    DQ = "disqualification",
    NWS = "newspaper decision",
}

export interface BoxrecSuspension {
    issuedBy: BoxrecId | null;
    type: string;
    startDate: string;
    endDate: string;
    lengthInDays: number;
    eventId: number | null;
}

export type Stance = "orthodox" | "southpaw";

export interface BoxrecRating extends BoxrecBasic {
    points: number | null;
    rating: number | null;
    age: number | null;
    record: Record;
    last6: WinLossDraw[];
    stance: Stance | null;
    residence: Location;
    division: string | null;
}

export interface BoxrecSearch extends BoxrecBasic {
    id: number;
    alias: string | null;
    record: Record;
    last6: WinLossDraw[];
    division: string | null;
    career: (number | null)[];
    residence: Location;
}
