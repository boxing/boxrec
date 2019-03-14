import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileCommonRow} from "./boxrec.profile.common.row";

export class BoxrecPageProfileOtherCommonBoutRow extends BoxrecProfileCommonRow {

    protected readonly $: CheerioStatic;

    protected parseLinks(): Cheerio {
        return this.$(getColumnData(this.$, 14));
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
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 2, false));
    }

    // todo this seems backwards but the previous code had it the same way.  Need to investigate
    get hasBoxerRatings(): boolean {
        return !this.hasMoreColumns;
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 11));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnData(this.$, 13, false));
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 12, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 14, false));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 6));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 10));
    }

    get secondBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 8));
        }

        return [];
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 9));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 7, false));
    }

    private get hasMoreColumns(): boolean {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        return this.$(`tr:nth-child(1) td`).length === 16;
    }

}
