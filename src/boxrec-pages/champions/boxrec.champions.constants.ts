import {BoxrecBasic} from "../boxrec.constants";

export interface BoxrecChampionsByWeightDivision {
    bantamweight: BoxrecBelts;
    cruiserweight: BoxrecBelts;
    featherWeight: BoxrecBelts;
    flyweight: BoxrecBelts;
    heavyweight: BoxrecBelts;
    lightFlyweight: BoxrecBelts;
    lightHeavyweight: BoxrecBelts;
    lightweight: BoxrecBelts;
    middleweight: BoxrecBelts;
    minimumweight: BoxrecBelts;
    superBantamweight: BoxrecBelts;
    superFeatherweight: BoxrecBelts;
    superFlyweight: BoxrecBelts;
    superLightweight: BoxrecBelts;
    superMiddleweight: BoxrecBelts;
    superWelterweight: BoxrecBelts;
    welterweight: BoxrecBelts;
}

export interface BoxrecBelts {
    BoxRec: BoxrecBasic | null;
    IBF: BoxrecBasic | null;
    IBO: BoxrecBasic | null;
    WBA: BoxrecBasic | null;
    WBC: BoxrecBasic | null;
    WBO: BoxrecBasic | null;
}

export interface BoxrecUnformattedChampions {
    beltHolders: BoxrecBelts;
    weightDivision: WeightDivision;
}

export enum WeightDivision {
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