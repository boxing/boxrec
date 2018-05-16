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
    win: number | null;
    loss: number | null;
    draw: number | null;
}

export interface BoxrecId {
    id: string | null;
    name: string | null;
}

export interface BoxrecBoutBasic {
    judges: BoxrecJudge[];
    metadata: string;
    titles: BoxrecId[];
    rating: number | null;
    links: Object;
    result: [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null];
    referee: BoxrecBasic;

    firstBoxerWeight: number | null;

    secondBoxer: BoxrecBasic;
    secondBoxerLast6: WinLossDraw[];
    secondBoxerRecord: Record;
    secondBoxerWeight: number | null;
}

export interface BoxrecBout extends BoxrecBoutBasic {
    date: string;
    location: BoxrecBoutLocation;
}

export interface BoxrecEventBout extends BoxrecBoutBasic {
    firstBoxer: BoxrecBasic;
    firstBoxerLast6: WinLossDraw[];
    firstBoxerRecord: Record;
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

export interface BoxrecEvent {
    date: string;
    commission: string | null;
    matchmaker: BoxrecBasic[];
    location: BoxrecBoutLocation;
    promoter: BoxrecPromoter[];
    television: string[] | null;
    bouts: BoxrecEventBout[];
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

export interface BoxrecBelts {
    BoxRec: BoxrecBasic | null;
    WBC: BoxrecBasic | null;
    IBO: BoxrecBasic | null;
    WBO: BoxrecBasic | null;
    IBF: BoxrecBasic | null;
    WBA: BoxrecBasic | null;
}

export interface BoxrecPromoter extends BoxrecBasic {
    company: string | null;
}

export interface BoxrecUnformattedChampions {
    weightClass: string;
    beltHolders: BoxrecBelts;
}

// todo does this pose an issue with ABC companies and different weight class names?
export enum WeightClass {
    heavyweight = "heavyweight",
    cruiserweight = "cruiserweight",
    lightHeavyweight = "light heavyweight",
    superMiddleweight = "super middleweight",
    middleweight = "middleweight",
    superWelterweight = "super welterweight",
    welterweight = "welterweight",
    superLightweight = "super lightweight",
    lightweight = "lightweight",
    superFeatherweight = "super featherweight",
    featherweight = "featherweight",
    superBantamweight = "super bantamweight",
    bantamweight = "bantamweight",
    superFlyweight = "super flyweight",
    flyweight = "flyweight",
    lightFlyweight = "light flyweight",
    minimumweight = "minimumweight"
}

export interface BoxrecChampionsByWeightClass {
    heavyweight: BoxrecBelts;
    cruiserweight: BoxrecBelts;
    lightHeavyweight: BoxrecBelts;
    superMiddleweight: BoxrecBelts;
    middleweight: BoxrecBelts;
    superWelterweight: BoxrecBelts;
    welterweight: BoxrecBelts;
    superLightweight: BoxrecBelts;
    lightweight: BoxrecBelts;
    superFeatherweight: BoxrecBelts;
    featherWeight: BoxrecBelts;
    superBantamweight: BoxrecBelts;
    bantamweight: BoxrecBelts;
    superFlyweight: BoxrecBelts;
    flyweight: BoxrecBelts;
    lightFlyweight: BoxrecBelts;
    minimumweight: BoxrecBelts;
}
