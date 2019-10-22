import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {IdGetter, IdInterface} from "../../decorators/id.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";

@IdGetter()
export abstract class BoxrecPageRatingsRow implements IdInterface {

    id: number;

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get hasBoutScheduled(): boolean {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.name, false)
            .slice(-1) === "*";
    }

    get last6(): WinLossDraw[] {
        // `record` and `last6` *were* lumped under the same `td` at one point
        return BoxrecCommonTablesColumnsClass.parseLast6Column(
            getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.firstLast6));
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name, false));
    }

    get points(): number | null {
        const pointsData: string = getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.points, false);
        const points: number = parseInt(pointsData, 10);

        return !isNaN(points) ? points : null;
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.record));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass
            .parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
                BoxrecCommonTableHeader.residence));
    }

    get stance(): Stance {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.stance, false) as Stance;
    }
}
