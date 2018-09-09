import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecBasic, Location} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageProfileEventRow {

    private $: CheerioStatic;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 1, false));
    }

    get links(): string {
        // todo does this even work?
        return getColumnData(this.$, 4);
    }

    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(getColumnData(this.$, 3));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    // todo same as another we can remove this
    get venue(): BoxrecBasic {
        const html: Cheerio = this.$(`<div>${getColumnData(this.$, 2)}</div>`);
        const venue: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: RegExpMatchArray | null = this.$(elem).get(0).attribs.href.match(/(\d+)$/);
            if (href) {
                venue.name = this.$(elem).text();
                venue.id = parseInt(href[1], 10);
            }

        });

        return venue;
    }

}
