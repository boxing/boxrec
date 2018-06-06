import {BoxrecBasic} from "../boxrec.constants";

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

export interface BoxrecBelts {
    BoxRec: BoxrecBasic | null;
    WBC: BoxrecBasic | null;
    IBO: BoxrecBasic | null;
    WBO: BoxrecBasic | null;
    IBF: BoxrecBasic | null;
    WBA: BoxrecBasic | null;
}

export interface BoxrecUnformattedChampions {
    weightClass: WeightClass;
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