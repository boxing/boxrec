import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {Location} from "../boxrec.constants";
import {BoxrecPageEventCommonRow} from "../location/event/boxrec.page.event.common.row";

// used for profiles other than boxers
export class BoxrecPageProfileEventRow extends BoxrecPageEventCommonRow {

    protected readonly $: CheerioStatic;

    protected getVenueColumnData(): Cheerio {
        return this.$(`<div>${this.getColumnData(2)}</div>`);
    }

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        super(html);
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(this.getColumnData(1, false));
    }

    // todo should return object
    get links(): string {
        return this.getColumnData(4);
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(this.getColumnData(3));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

}
