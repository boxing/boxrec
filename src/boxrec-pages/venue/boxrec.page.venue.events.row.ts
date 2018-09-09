import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesImprovedClass} from "../boxrec-common-tables/boxrec-common-tables-improved.class";
import {Location} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageVenueEventsRow {

    constructor(boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        $ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData($, 2));
    }

    get day(): string {
        return getColumnData($, 3);
    }

    get id(): number | null {
        return BoxrecCommonTablesImprovedClass.parseId(getColumnData($, 5));
    }

    get location(): Location {
        return BoxrecCommonTablesImprovedClass.parseLocationLink(getColumnData($, 4), 2);
    }

}
