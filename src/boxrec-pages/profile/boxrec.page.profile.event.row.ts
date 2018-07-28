import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecBasic, Location} from "../boxrec.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileEventRow extends BoxrecCommonTablesClass {

    protected role: BoxrecRole = BoxrecRole.boxer;
    private _date: string;
    private _links: string;
    private _location: string;
    private _startColumn: number = 0;
    private _venue: string;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);
        this.parseBout();
        this.parseMetadata();
    }

    get date(): string {
        return trimRemoveLineBreaks(this._date);
    }

    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location);
    }

    // todo same as another we can remove this
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

    private getColumnData(returnHtml: boolean = false): string {
        this._startColumn++;
        return getColumnData($, this._startColumn, returnHtml);
    }

    private parseBout(): void {
        this._date = this.getColumnData();
        this._venue = this.getColumnData(true);
        this._location = this.getColumnData(true);
        this._links = this.getColumnData(true);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}
