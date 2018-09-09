import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecBasic, Location} from "../../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageLocationEventRow {

    private $: CheerioStatic;

    constructor(boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(this.getColumnData(2, false));
    }

    get day(): string {
        return this.getColumnData(3, false);
    }

    get id(): number | null {
        return BoxrecCommonTablesColumnsClass.parseId(this.getColumnData(6));
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(this.getColumnData(5), 2);
    }

    get venue(): BoxrecBasic {
        const venueStr: string = this.getColumnData(4);
        const html: Cheerio = this.$(`<div>${venueStr}</div>`);
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

    private getColumnData(colNum: number, returnHTML: boolean = true): string {
        let columnNumber: number = colNum;
        if (this.hasMoreColumns()) {
            columnNumber++;
        }
        return getColumnData(this.$, columnNumber, returnHTML);
    }

    private hasMoreColumns(): boolean {
        return this.$(`tr:nth-child(1) td`).length === 7;
    }

}
