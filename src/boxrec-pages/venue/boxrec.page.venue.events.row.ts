import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecPageVenueEventsRowOutput} from "./boxrec.page.venue.constants";

export class BoxrecPageVenueEventsRow {

    private readonly $: CheerioStatic;

    constructor(private headerColumnTextArr: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$, this.headerColumnTextArr, "date", false));
    }

    get day(): string {
        return getColumnDataByColumnHeader(this.$, this.headerColumnTextArr, "day", false);
    }

    get id(): number | null {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 5));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$,
            this.headerColumnTextArr, "location"), 2);
    }

    get output(): BoxrecPageVenueEventsRowOutput {
        return {
            date: this.date,
            day: this.day,
            id: this.id,
            location: this.location,
        };
    }

}
