import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * parse a BoxRec Ratings Page
 * <pre>ex. http://boxrec.com/en/ratings</pre>
 */
export class BoxrecPageRatings {

    private _ratings: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseRatings();
    }

    get boxers(): BoxrecPageRatingsRow[] {
        return this._ratings.map(item => new BoxrecPageRatingsRow(item));
    }

    private parseRatings(): void {
        const tr: Cheerio = $(".dataTable tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._ratings.push(html);
        });
    }

}
