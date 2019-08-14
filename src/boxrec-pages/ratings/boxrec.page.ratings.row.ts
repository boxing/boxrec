import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";

export abstract class BoxrecPageRatingsRow {

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get hasBoutScheduled(): boolean {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, "name", false).slice(-1) === "*";
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(
            getColumnDataByColumnHeader(this.$, this.headerColumns, "name")) as number;
    }

    get last6(): WinLossDraw[] {
        // `record` and `last6` *were* lumped under the same `td` at one point
        return BoxrecCommonTablesColumnsClass.parseLast6Column(
            getColumnDataByColumnHeader(this.$, this.headerColumns, "last 6")
        );
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnDataByColumnHeader(this.$, this.headerColumns,
            "name", false));
    }

    get points(): number | null {
        const pointsData: string = getColumnDataByColumnHeader(this.$, this.headerColumns, "points", false);
        const points: number = parseInt(pointsData, 10);

        return !isNaN(points) ? points : null;
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            "w-l-d"));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass
            .parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns, "residence"));
    }

    get stance(): Stance {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, "stance", false) as Stance;
    }
}
