import * as cheerio from "cheerio";
import {BoxrecPageLocationEventRow} from "./boxrec.page.location.event.row";

/**
 * parse a BoxRec Locate Events results page
 * <pre>ex. http://boxrec.com/en/locations/event?l%5Bcountry%5D=US&l%5Bregion%5D=CO&l%5Btown%5D=&l%5Bvenue%5D=&l%5Byear%5D=2017&l_go=</pre>
 */
export class BoxrecPageLocationEvent {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get events(): BoxrecPageLocationEventRow[] {
        return this.parseLocation().map(item => new BoxrecPageLocationEventRow(item));
    }

    private parseLocation(): string[] {
        const tr: Cheerio = this.$(".dataTable tbody tr");
        const locations: string[] = [];
        tr.each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            locations.push(html);
        });

        return locations;
    }

}
