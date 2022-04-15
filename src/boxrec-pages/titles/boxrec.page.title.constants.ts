import {BoxrecGeneralLinks} from '../../boxrec-common-tables/boxrec-common.constants';
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from '../boxrec.constants';
import {WeightDivision} from '../champions/boxrec.champions.constants';

// the params for searching titles are capitalized divisions
export enum WeightDivisionCapitalized {
    heavyweight = 'Heavyweight',
    cruiserweight = 'Cruiserweight',
    lightHeavyweight = 'Light Heavyweight',
    superMiddleweight = 'Super Middleweight',
    middleweight = 'Middleweight',
    superWelterweight = 'Super Welterweight',
    welterweight = 'Welterweight',
    superLightweight = 'Super Lightweight',
    lightweight = 'Lightweight',
    superFeatherweight = 'Super Featherweight',
    featherweight = 'Featherweight',
    superBantamweight = 'Super Bantamweight',
    bantamweight = 'Bantamweight',
    superFlyweight = 'Super Flyweight',
    flyweight = 'Flyweight',
    lightFlyweight = 'Light Flyweight',
    minimumweight = 'Minimumweight'
}

export interface BoxrecTitlesParams {
    bout_title: number;
    division: WeightDivisionCapitalized;
}

export interface BoxrecTitlesOutput {
    bouts: BoxrecPageTitlesRowOutput[];
    numberOfBouts: number;
    numberOfPages: number;
}

export interface BoxrecPageTitlesRowOutput {
    date: string;
    division: WeightDivision | null;
    firstBoxer: BoxrecBasic;
    firstBoxerWeight: number | null;
    links: BoxrecGeneralLinks;
    location: BoxrecLocation;
    metadata: string | null;
    numberOfRounds: number[];
    outcome: WinLossDraw;
    rating: number | null;
    secondBoxer: BoxrecBasic;
    secondBoxerWeight: number | null;
}
