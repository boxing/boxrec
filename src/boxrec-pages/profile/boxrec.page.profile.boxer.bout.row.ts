import {BoxrecCommonTablesColumnsClass} from '../../boxrec-common-tables/boxrec-common-tables-columns.class';
import {BoxrecTitles} from '../../boxrec-common-tables/boxrec-common.constants';
import {DateGetter, DateInterface} from '../../decorators/date.decorator';
import {FirstBoxerWeightGetter, FirstBoxerWeightInterface} from '../../decorators/firstBoxerWeight.decorator';
import {MetadataGetter, MetadataInterface} from '../../decorators/metadata.decorator';
import {OutcomeGetter, OutcomeInterface} from '../../decorators/outcome.decorator';
import {OutputGetter, OutputInterface} from '../../decorators/output.decorator';
import {RatingGetter, RatingInterface} from '../../decorators/rating.decorator';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from '../../helpers';
import {BoxrecBasic, BoxrecJudge, Record, WinLossDraw} from '../boxrec.constants';
import {BoxingBoutOutcome} from '../event/boxrec.event.constants';
import {BoxrecProfileBoxerBoutOutput} from './boxrec.page.profile.constants';
import {BoxrecProfileCommonRow} from './boxrec.profile.common.row';

@DateGetter()
@FirstBoxerWeightGetter()
@MetadataGetter()
@OutcomeGetter(BoxrecCommonTableHeader.result)
@OutputGetter([
    'date',
    'firstBoxerRating',
    'firstBoxerWeight',
    'judges',
    'links',
    'location',
    'metadata',
    'numberOfRounds',
    'outcome',
    'rating',
    'referee',
    'result',
    'secondBoxer',
    'secondBoxerLast6',
    'secondBoxerRating',
    'secondBoxerRecord',
    'secondBoxerWeight',
    'titles'
])
@RatingGetter()
export class BoxrecPageProfileBoxerBoutRow extends BoxrecProfileCommonRow
    implements DateInterface, FirstBoxerWeightInterface,
        MetadataInterface, OutcomeInterface, OutputInterface, RatingInterface {

    date: string;
    firstBoxerWeight: number | null;
    metadata: string | null;
    outcome: WinLossDraw;
    output: BoxrecProfileBoxerBoutOutput;
    rating: number | null;

    /**
     * Parses ratings of a boxer
     * @param {string} rating
     * @returns number | null
     */
    static parseBoxerRating(rating: string): number | null {
        const ratingsMatch: string = trimRemoveLineBreaks(rating);

        if (ratingsMatch) {
            return parseFloat(ratingsMatch);
        }

        return null;
    }

    private static outcomeByWayOf(htmlString: string, parseText: boolean = false): BoxingBoutOutcome | string | null {
        return BoxrecCommonTablesColumnsClass.parseOutcomeByWayOf(htmlString, parseText);
    }

    /**
     * Returns the boxer's rating in number of points
     * Number is result of the outcome of the fight
     * Higher number is better
     * @returns {number | null}
     */
    get firstBoxerRating(): number | null {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstRating));
    }

    get judges(): BoxrecJudge[] {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseJudges(metadata);
        }

        return [];
    }

    /**
     * Returns string for location because BoxRec doesn't have links in the location and this is safer than trying
     * to guess if the location object is correct
     */
    get location(): string {
        return trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.location, false));
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.rounds));
    }

    get referee(): BoxrecBasic {
        const metadata: string = this.metadata || '';
        return BoxrecCommonTablesColumnsClass.parseReferee(metadata);
    }

    get result(): [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null] {
        const result: any = getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.outcomeByWayOf);
        // const result: string = getColumnData(this.$, 13);
        return [
            this.outcome,
            BoxrecPageProfileBoxerBoutRow.outcomeByWayOf(result),
            BoxrecPageProfileBoxerBoutRow.outcomeByWayOf(result, true)
        ];
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.opponent));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        // we return first fighter last 6 because the table only contains the opponents last 6
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstLast6));
    }

    /**
     * Returns the opponent's rating in number of points
     * Number is result of the outcome of the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get secondBoxerRating(): number | null {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondRating));
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.record));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondFighterWeight, false));
    }

    get titles(): BoxrecTitles[] {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseTitles(metadata);
        }

        return [];
    }

}
