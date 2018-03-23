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

export interface BoxrecBoutLocation {
    location: {
        town: string | null;
        id: number | null;
        region: string | null;
        country: string | null;
    };
    venue: {
        id: number | null;
        name: string | null;
    };
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

export interface BoxrecTitles extends BoxrecBasic {
    id: any; // string
}

export interface BoxrecJudge extends BoxrecBasic {
    scorecard: number[];
}

export interface BoxrecBout {
    date: string;
    firstBoxerWeight: number | null;
    secondBoxerWeight: number | null;
    opponent: BoxrecBasic | null;
    opponentLast6: WinLossDraw[];
    opponentRecord: {
        win: number;
        loss: number;
        draw: number;
    };
    referee: BoxrecBasic,
    judges: BoxrecJudge[],
    metadata: string,
    titles: BoxrecTitles[];
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
