import {BoxrecCommonTablesClass} from "../../boxrec-common-tables/boxrec-common-tables.class";
import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecBasic, Location} from "../../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageLocationEventRow extends BoxrecCommonTablesClass {

    private _date: string;
    private _day: string;
    private _venue: string;
    private _location: string;
    private _event: string;

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

    get venue(): BoxrecBasic {
        const html: Cheerio = $(`<div>${this._venue}</div>`);
        const venue: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: RegExpMatchArray | null = $(elem).get(0).attribs.href.match(/(\d+)$/);
            if (href) {
                venue.name = $(elem).text();
                venue.id = parseInt(href[1], 10);
            }

        });

        return venue;
    }

    get location(): Location {
        return super.parseLocationLink(this._location, 2);
    }

    get id(): number | null {
        return super.parseId(this._event);
    }

    parse(): void {
        // the first two columns are map and if it has happened
        this._date = getColumnData($, 3, false);
        this._day = getColumnData($, 4, false);
        this._venue = getColumnData($, 5);
        this._location = getColumnData($, 6);
        this._event = getColumnData($, 7);
    }

}
