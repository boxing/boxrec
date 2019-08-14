import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {RatingsColumns} from "./boxrec.ratings.constants";

export abstract class BoxrecPageRatingsRow {

    protected readonly $: CheerioStatic;

    constructor(private headerColumnText: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get hasBoutScheduled(): boolean {
        return getColumnData(this.$, this.getColumnByType("name"), false).slice(-1) === "*";
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$,
            this.getColumnByType("name"))) as number;
    }

    get last6(): WinLossDraw[] {
        // `record` and `last6` *were* lumped under the same `td` at one point
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, this.getColumnByType("last 6")));
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnData(this.$, this.getColumnByType("name")));
    }

    get points(): number | null {
        const points: number = parseInt(getColumnData(this.$, 3, false),
            this.getColumnByType("points"));

        return !isNaN(points) ? points : null;
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, this.getColumnByType("w-l-d")));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass
            .parseLocationLink(getColumnData(this.$, this.getColumnByType("residence")));
    }

    get stance(): Stance {
        return getColumnDataByColumnHeader(this.$, "stance", false) as Stance;
        //return trimRemoveLineBreaks(getColumnData(this.$, this.getColumnByType("stance"), false)) as Stance;
    }

    // classes that inherit this class require a `columns` array
    protected getColumnByType(columnType: RatingsColumns): number {
        // todo instead of hardcoding the columns, find the column by name
        if (this.headerColumnText.length === 0) {
            throw new Error("Could not get any header columns?");
        }

        const columnIdx: number = this.headerColumnText.findIndex(item => item === columnType);

        if (columnIdx > -1) {
            return columnIdx + 1;
        }

        throw new Error(`Trying to find column that isn't accounted for: ${columnType}`);
    }

}
