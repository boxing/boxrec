import {BoxrecCommonTablesClass} from "../../boxrec-common-tables/boxrec-common-tables.class";
import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecBasic, Location} from "../../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageLocationEventRow extends BoxrecCommonTablesClass {

    private _date: string;
    private _day: string;
    private _event: string;
    private _location: string;
    private _venue: string;

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
        return BoxrecCommonTablesClass.parseId(this._event);
    }

    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location, 2);
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

    private parse(): void {
        const numberOfColumns: number = $(`tr:nth-child(1) td`).length;

        if (numberOfColumns === 6) {
            this._date = getColumnData($, 2, false);
            this._day = getColumnData($, 3, false);
            this._venue = getColumnData($, 4);
            this._location = getColumnData($, 5);
            this._event = getColumnData($, 6);
        } else if (numberOfColumns === 7) {
            this._date = getColumnData($, 3, false);
            this._day = getColumnData($, 4, false);
            this._venue = getColumnData($, 5);
            this._location = getColumnData($, 6);
            this._event = getColumnData($, 7);
        }
    }

}
