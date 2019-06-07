import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecLocation, Record, Stance, WinLossDraw} from "../boxrec.constants";

// do not include `id` or `last6` which are part of `name` and `record` columns
type RatingsColumns =
    "name" | "points" | "rating" | "age" | "career" |
    "record" | "stance" | "residence" | "division" | "ranking";

export abstract class BoxrecPageRatingsRow {

    protected readonly $: CheerioStatic;
    protected abstract readonly columns: string[] = []; // abstracted

    constructor(boxrecBodyBout: string) {
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
        // `record` and `last6` are lumped under the same `td`
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, this.getColumnByType("record")));
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
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, this.getColumnByType("record")));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass
            .parseLocationLink(getColumnData(this.$, this.getColumnByType("residence")));
    }

    get stance(): Stance {
        return trimRemoveLineBreaks(getColumnData(this.$, this.getColumnByType("stance"), false)) as Stance;
    }

    // classes that inherit this class require a `columns` array
    protected getColumnByType(columnType: RatingsColumns): number {
        let columnIdx: number = this.columns.findIndex(item => item === columnType);

        if (columnIdx > -1) {
            columnIdx++;
        } else {
            throw new Error("Trying to find column that isn't accounted for");
        }

        return columnIdx;
    }

}
