import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {Location} from "../boxrec.constants";
import {BoxrecPageEventCommonRow} from "../location/event/boxrec.page.event.common.row";
import {BoxrecProfileEventLinks} from "./boxrec.profile.constants";

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

    get links(): BoxrecProfileEventLinks {
        const linksStr: string = `<div>${this.getColumnData(4)}</div>`;
        const html: Cheerio = this.$(linksStr);
        const obj: BoxrecProfileEventLinks = {
            event: null,
        };

        return BoxrecCommonLinks.parseLinkInformation<BoxrecProfileEventLinks>(html, obj);
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(this.getColumnData(3));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

}
