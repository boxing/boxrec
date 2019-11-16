import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecTitles} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxerGetter} from "../../decorators/boxer.decorator";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxerWeightInterface, WeightGetter} from "../../decorators/weight.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecJudge, Record, WinLossDraw} from "../boxrec.constants";
import {BoxingBoutOutcome} from "../event/boxrec.event.constants";
import {BoxrecProfileBoxerBoutOutput} from "./boxrec.page.profile.constants";
import {BoxrecProfileCommonRow} from "./boxrec.profile.common.row";

@BoxerGetter("secondBoxer")
@DateGetter()
@MetadataGetter()
@OutcomeGetter(BoxrecCommonTableHeader.result)
@OutputGetter([
    "date",
    "firstBoxerRating",
    "firstBoxerWeight",
    "judges",
    "links",
    "location",
    "metadata",
    "numberOfRounds",
    "outcome",
    "rating",
    "referee",
    "result",
    "secondBoxer",
    "secondBoxerLast6",
    "secondBoxerRating",
    "secondBoxerRecord",
    "secondBoxerWeight",
    "titles"
])
@RatingGetter()
@WeightGetter()
@WeightGetter("secondBoxerWeight")
export class BoxrecPageProfileBoxerBoutRow extends BoxrecProfileCommonRow
    implements DateInterface, BoxerWeightInterface,
        MetadataInterface, OutcomeInterface, OutputInterface, RatingInterface {

    date: string;
    firstBoxerWeight: number | null;
    metadata: string | null;
    outcome: WinLossDraw;
    output: BoxrecProfileBoxerBoutOutput;
    rating: number | null;
    secondBoxerWeight: number | null;

    /**
     * Parses Before/After ratings of a boxer
     * @param {string} rating
     * @returns {Array<number | null>}
     */
    static parseBoxerRating(rating: string): Array<number | null> {
        const ratings: Array<number | null> = [null, null];
        const ratingsMatch: RegExpMatchArray | null = trimRemoveLineBreaks(rating)
            .replace(/,/g, "")
            .match(/^([\d.]+)&#x279E;([\d.]+)$/);

        if (ratingsMatch) {
            ratings[0] = parseFloat(ratingsMatch[1]);
            ratings[1] = parseFloat(ratingsMatch[2]);
        }

        return ratings;
    }

    private static outcomeByWayOf(htmlString: string, parseText: boolean = false): BoxingBoutOutcome | string | null {
        return BoxrecCommonTablesColumnsClass.parseOutcomeByWayOf(htmlString, parseText);
    }

    /**
     * Returns the boxer's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get firstBoxerRating(): Array<number | null> {
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
        const metadata: string = this.metadata || "";
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

    get secondBoxerLast6(): WinLossDraw[] {
        // we return first fighter last 6 because the table only contains the opponents last 6
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstLast6));
    }

    /**
     * Returns the opponents's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get secondBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondRating));
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.record));
    }

    get titles(): BoxrecTitles[] {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseTitles(metadata);
        }

        return [];
    }

}
