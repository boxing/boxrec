import {BoxrecTitles} from '../../../boxrec-common-tables/boxrec-common.constants';
import {BoxrecBasic, BoxrecBoutLocation, BoxrecJudge, Record, Stance, WinLossDraw} from '../../boxrec.constants';
import {WeightDivision} from '../../champions/boxrec.champions.constants';
import {BoxingBoutOutcome} from '../boxrec.event.constants';
import {BoxrecPageEventBoutRow} from '../boxrec.page.event.bout.row';

export interface BoutPageLast6 extends BoutPageOutcome {
    date: string | null;
    id: number | null;
    name: string | null;
}

export interface BoutPageOutcome {
    outcome: WinLossDraw | null;
    outcomeByWayOf: BoxingBoutOutcome | null;
}

export interface BoutPageBoutOutcome extends BoutPageOutcome {
    boxer: BoxrecBasic;
}

export interface BoxrecEventBoutOutput {
    bouts: BoxrecPageEventBoutRow[];
    commission: string | null;
    date: string | null;
    division: WeightDivision | null;
    doctors: BoxrecBasic[];
    firstBoxer: BoxrecBasic;
    firstBoxerAge: number | null;
    firstBoxerHeight: number[] | null;
    firstBoxerKOs: number;
    firstBoxerLast6: BoutPageLast6[];
    firstBoxerPointsAfter: number | null;
    firstBoxerRanking: number | null;
    firstBoxerReach: number[] | null;
    firstBoxerRecord: Record;
    firstBoxerStance: Stance | null;
    id: number | null;
    inspector: BoxrecBasic;
    judges: BoxrecJudge[];
    location: BoxrecBoutLocation;
    matchmakers: BoxrecBasic[];
    media: string[];
    numberOfBouts: number;
    numberOfRounds: number | null;
    outcome: BoutPageBoutOutcome;
    promoters: BoxrecBasic[];
    rating: number | null;
    referee: BoxrecBasic;
    secondBoxer: BoxrecBasic;
    secondBoxerAge: number | null;
    secondBoxerHeight: number[] | null;
    secondBoxerKOs: number;
    secondBoxerLast6: BoutPageLast6[];
    secondBoxerPointsAfter: number | null;
    secondBoxerRanking: number | null;
    secondBoxerReach: number[] | null;
    secondBoxerRecord: Record;
    secondBoxerStance: Stance | null;
    television: string[];
    titles: BoxrecTitles[];
}
