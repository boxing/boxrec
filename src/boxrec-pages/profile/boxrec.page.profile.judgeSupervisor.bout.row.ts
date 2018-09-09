import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesImprovedClass} from "../boxrec-common-tables/boxrec-common-tables-improved.class";
import {BoxrecBasic, Location, Record, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageProfileJudgeSupervisorBoutRow {

    private $: CheerioStatic;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 2, false));
    }

    get firstBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 4));
        }

        return [];
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesImprovedClass.parseWeight(getColumnData(this.$, 2, false));
    }

    // todo this seems backwards but the previous code had it the same way.  Need to investigate
    get hasBoxerRatings(): boolean {
        return !this.hasMoreColumns;
    }

    // todo does this work, what is it?
    get links(): string {
        return getColumnData(this.$, 15);
    }

    get location(): Location {
        return BoxrecCommonTablesImprovedClass.parseLocationLink(getColumnData(this.$, 11));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesImprovedClass.parseNumberOfRounds(getColumnData(this.$, 13, false));
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesImprovedClass.parseOutcome(getColumnData(this.$, 12, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesImprovedClass.parseRating(getColumnData(this.$, 14, false));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesImprovedClass.parseNameAndId(getColumnData(this.$, 6));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesImprovedClass.parseLast6Column(getColumnData(this.$, 10));
    }

    get secondBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 8));
        }

        return [];
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesImprovedClass.parseRecord(getColumnData(this.$, 9));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesImprovedClass.parseWeight(getColumnData(this.$, 7, false));
    }

    private get hasMoreColumns(): boolean {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        return this.$(`tr:nth-child(1) td`).length === 16;
    }

}
