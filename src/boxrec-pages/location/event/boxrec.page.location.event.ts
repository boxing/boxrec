import {BoxrecPageLocationEventRow} from "./boxrec.page.location.event.row";


const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * parse a BoxRec Locate Events results page
 * <pre>ex. http://boxrec.com/en/locations/event?l%5Bcountry%5D=US&l%5Bregion%5D=CO&l%5Btown%5D=&l%5Bvenue%5D=&l%5Byear%5D=2017&l_go=</pre>
 */
export class BoxrecPageLocationEvent {

    _locations: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseLocation();
    }

    get output(): BoxrecPageLocationEventRow[] {
        return this._locations.map(item => new BoxrecPageLocationEventRow(item));
    }

    private parseLocation(): void {
        const tr: Cheerio = $("table#locationsTable tbody tr");
        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._locations.push(html);
        });
    }

}