import {BoxrecBasic} from "@boxrec-constants";
import {getColumnData} from "@helpers";
import * as cheerio from "cheerio";

export abstract class BoxrecPageEventCommonRow {

    protected readonly $: CheerioStatic;

    protected constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    get venue(): BoxrecBasic {
        const html: Cheerio = this.getVenueColumnData();
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

    protected getColumnData(colNum: number, returnHTML: boolean = true): string {
        let columnNumber: number = colNum;
        if (this.hasMoreColumns()) {
            columnNumber++;
        }
        return getColumnData(this.$, columnNumber, returnHTML);
    }

    protected getVenueColumnData(): Cheerio {
        throw new Error("Needs to be overridden by child class");
    }

    // this method if needed should be overridden in child class
    protected hasMoreColumns(): boolean {
        return false;
    }

}
