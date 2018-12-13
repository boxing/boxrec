// the params for searching titles are capitalized divisions
export enum WeightDivisionCapitalized {
    heavyweight = "Heavyweight",
    cruiserweight = "Cruiserweight",
    lightHeavyweight = "Light Heavyweight",
    superMiddleweight = "Super Middleweight",
    middleweight = "Middleweight",
    superWelterweight = "Super Welterweight",
    welterweight = "Welterweight",
    superLightweight = "Super Lightweight",
    lightweight = "Lightweight",
    superFeatherweight = "Super Featherweight",
    featherweight = "Featherweight",
    superBantamweight = "Super Bantamweight",
    bantamweight = "Bantamweight",
    superFlyweight = "Super Flyweight",
    flyweight = "Flyweight",
    lightFlyweight = "Light Flyweight",
    minimumweight = "Minimumweight"
}

export interface BoxrecTitlesParams {
    bout_title: number;
    division: WeightDivisionCapitalized;
}

export interface BoxrecTitlesParamsTransformed {
    "WcX[bout_title]"?: number;
    "WcX[division]"?: WeightDivisionCapitalized;
    offset?: number;
}
