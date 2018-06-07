import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * parse a BoxRec Ratings Page
 * ex. http://boxrec.com/en/ratings
 */
export class BoxrecPageRatings {

    private _ratings: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseRatings();
    }

    get output(): BoxrecPageRatingsRow[] {
        const ratings: string[] = this._ratings;
        let ratingsList: BoxrecPageRatingsRow[] = [];

        ratings.forEach((val: string) => {
            const rating: BoxrecPageRatingsRow = new BoxrecPageRatingsRow(val);
            ratingsList.push(rating);
        });

        return ratingsList;
    }

    private parseRatings(): void {
        const tr: Cheerio = $("table#ratingsResults tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._ratings.push(html);
        });
    }

}
