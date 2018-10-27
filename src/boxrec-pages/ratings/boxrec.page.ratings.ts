import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

const cheerio: CheerioAPI = require("cheerio");

/**
 * parse a BoxRec Ratings Page
 * <pre>ex. http://boxrec.com/en/ratings</pre>
 */
export class BoxrecPageRatings {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxers(): BoxrecPageRatingsRow[] {
        return this.parseRatings().map(item => new BoxrecPageRatingsRow(item));
    }

    private parseRatings(): string[] {
        const tr: Cheerio = this.$(".dataTable tbody tr");
        const ratings: string[] = [];

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            ratings.push(html);
        });

        return ratings;
    }

}
