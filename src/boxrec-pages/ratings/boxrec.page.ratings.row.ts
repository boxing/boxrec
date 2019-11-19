import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {IdGetter, IdInterface} from "../../decorators/id.decorator";
import {Last6Getter, Last6Interface} from "../../decorators/last6.decorator";
import {RecordGetter, RecordInterface} from "../../decorators/record.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";

@IdGetter()
@Last6Getter()
@RecordGetter()
export abstract class BoxrecPageRatingsRow implements IdInterface, Last6Interface, RecordInterface {

    id: number;
    // `record` and `last6` *were* lumped under the same `td` at one point
    last6: WinLossDraw[];
    record: Record;

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get hasBoutScheduled(): boolean {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.name, false)
            .slice(-1) === "*";
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

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass
            .parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
                BoxrecCommonTableHeader.residence));
    }

    get stance(): Stance {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.stance, false) as Stance;
    }
}
