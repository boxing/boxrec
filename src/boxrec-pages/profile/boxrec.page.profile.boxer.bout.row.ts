import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecTitles} from "../../boxrec-common-tables/boxrec-common.constants";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecJudge, Record, WinLossDraw} from "../boxrec.constants";
import {BoxingBoutOutcome} from "../event/boxrec.event.constants";
import {BoxrecProfileBoxerBoutOutput} from "./boxrec.page.profile.constants";
import {BoxrecProfileCommonRow} from "./boxrec.profile.common.row";

export class BoxrecPageProfileBoxerBoutRow extends BoxrecProfileCommonRow {

    protected readonly $: CheerioStatic;

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

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 2, false));
    }

    /**
     * Returns the boxer's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get firstBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 4));
        }

        return [];
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 3, false));
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
        return trimRemoveLineBreaks(getColumnData(this.$, 11, false));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnData(this.$, 14));
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 12, false));
    }

    get output(): BoxrecProfileBoxerBoutOutput {
        return {
            date: this.date,
            firstBoxerRating: this.firstBoxerRating,
            firstBoxerWeight: this.firstBoxerWeight,
            judges: this.judges,
            links: this.links,
            location: this.location,
            metadata: this.metadata,
            numberOfRounds: this.numberOfRounds,
            outcome: this.outcome,
            rating: this.rating,
            referee: this.referee,
            result: this.result,
            secondBoxer: this.secondBoxer,
            secondBoxerLast6: this.secondBoxerLast6,
            secondBoxerRating: this.secondBoxerRating,
            secondBoxerRecord: this.secondBoxerRecord,
            secondBoxerWeight: this.secondBoxerWeight,
            titles: this.titles,
        };
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 15));
    }

    get referee(): BoxrecBasic {
        const metadata: string = this.metadata || "";
        return BoxrecCommonTablesColumnsClass.parseReferee(metadata);
    }

    get result(): [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null] {
        const result: string = getColumnData(this.$, 13);
        return [
            this.outcome,
            BoxrecPageProfileBoxerBoutRow.outcomeByWayOf(result),
            BoxrecPageProfileBoxerBoutRow.outcomeByWayOf(result, true)
        ];
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 6));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 10));
    }

    /**
     * Returns the opponents's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get secondBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 8));
        }

        return [];
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 9));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 7, false));
    }

    get titles(): BoxrecTitles[] {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseTitles(metadata);
        }

        return [];
    }

    private get hasMoreColumns(): boolean {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        return this.$(`tr:nth-child(1) td`).length === 16;
    }

    protected parseLinks(): Cheerio {
        return this.$(getColumnData(this.$, 16, true));
    }

}
