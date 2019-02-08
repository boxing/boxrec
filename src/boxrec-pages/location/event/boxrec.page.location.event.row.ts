import {BoxrecCommonTablesColumnsClass} from "@boxrec-common-tables/boxrec-common-tables-columns.class";
import {Location} from "@boxrec-constants";
import {trimRemoveLineBreaks} from "@helpers";
import * as cheerio from "cheerio";
import {BoxrecPageEventCommonRow} from "./boxrec.page.event.common.row";

export class BoxrecPageLocationEventRow extends BoxrecPageEventCommonRow {

    protected readonly $: CheerioStatic;

    protected getVenueColumnData(): Cheerio {
        return this.$(`<div>${this.getColumnData(4)}</div>`);
    }

    // unused here but used in parent class
    protected hasMoreColumns(): boolean {
        return this.$(`tr:nth-child(1) td`).length === 7;
    }

    constructor(boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        super(html);
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(this.getColumnData(2, false));
    }

    get day(): string {
        return this.getColumnData(3, false);
    }

    get id(): number | null {
        return BoxrecCommonTablesColumnsClass.parseId(this.getColumnData(6));
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(this.getColumnData(5), 2);
    }

}
