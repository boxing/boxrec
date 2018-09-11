import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {Location} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageVenueEventsRow {

    private $: CheerioStatic;

    constructor(boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 2));
    }

    get day(): string {
        return getColumnData(this.$, 3);
    }

    get id(): number | null {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 5));
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 4), 2);
    }

}
