import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData} from "../../helpers";
import {BoxrecBasic, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecEventLinks} from "./boxrec.event.constants";

export class BoxrecPageEventBoutRow {

    private readonly $: CheerioStatic;
    private readonly isEventPage: boolean = false;

    constructor(boxrecBodyBout: string, additionalData: string | null = null, isEventPage = false) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.isEventPage = isEventPage; // should extend this class for date/event
        this.$ = cheerio.load(html);
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 2, false));
    }

    get firstBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 3));
    }

    get firstBoxerLast6(): WinLossDraw[] {
        const column: number = this.isEventPage ? 6 : 5;
        return BoxrecCommonTablesColumnsClass.parseLast6Column(this.getColumnData(column, 0, true));
    }

    // returns an object with keys that contain a class other than `primaryIcon`

    get firstBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(this.getColumnData(4));
    }

    get firstBoxerWeight(): number | null {
        if (this.hasMoreColumns) {
            return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 4, false));
        }

        return null;
    }

    // not the exact same as the other page links
    get links(): BoxrecEventLinks {
        const column: number = this.isEventPage ? 15 : 12;
        const linksStr: string = this.getColumnData(column, 0, true);

        return BoxrecCommonLinks.parseLinkInformation<BoxrecEventLinks>(this.$(linksStr), {
            bio: null,
            bout: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(this.getColumnData(7, 2));
    }

    get outcome(): WinLossDraw | null {
        if (this.hasMoreColumns) {
            return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 7, false));
        }

        return null;
    }

    get outcomeByWayOf(): string | null {
        if (this.hasMoreColumns) {
            return BoxrecCommonTablesColumnsClass.parseOutcomeByWayOf(getColumnData(this.$, 8));
        }

        return null;
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(this.getColumnData(11, 3));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(this.getColumnData(8, 2));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(this.getColumnData(10, 3));
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(this.getColumnData(9, 3));
    }

    get secondBoxerWeight(): number | null {
        if (this.hasMoreColumns) {
            return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 11, false));
        }

        return null;
    }

    private get hasMoreColumns(): boolean {
        // if event has occurred, there are number of different columns
        return this.$(`tr:nth-child(1) td`).length === 15;
    }

    private getColumnData(colNum: number, numberToBumpBy: number = 1, returnHTML: boolean = true): string {
        let columnNumber: number = colNum;
        if (this.hasMoreColumns) {
            columnNumber += numberToBumpBy;
        }
        return getColumnData(this.$, columnNumber, returnHTML);
    }

}
