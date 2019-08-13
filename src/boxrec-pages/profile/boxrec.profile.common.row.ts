import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";

// contains common functionality of profiles rows
export abstract class BoxrecProfileCommonRow {

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get links(): BoxrecGeneralLinks {
        return BoxrecCommonLinks.parseLinkInformation<BoxrecGeneralLinks>(this.$(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.links)), {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

}
