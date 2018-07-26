import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {Location} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageVenueEventsRow extends BoxrecCommonTablesClass {

    private _date: string;
    private _day: string;
    private _id: string;
    private _location: string;

    constructor(boxrecBodyBout: string) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        $ = cheerio.load(html);

        this.parse();
    }

    get date(): string {
        return trimRemoveLineBreaks(this._date);
    }

    get day(): string {
        return this._day;
    }

    get id(): number | null {
        return BoxrecCommonTablesClass.parseId(this._id);
    }

    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location, 2);
    }

    private parse(): void {
        // first column is a map link
        this._date = getColumnData($, 2);
        this._day = getColumnData($, 3);
        this._location = getColumnData($, 4);
        this._id = getColumnData($, 5);
    }

}