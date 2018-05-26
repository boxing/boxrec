import {BoxrecRating} from "../boxrec.constants";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

const cheerio = require("cheerio");
let $: CheerioAPI;

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

    get output(): BoxrecRating[] {
        const ratings = this._ratings;
        let ratingsList: BoxrecRating[] = [];

        ratings.forEach((val: string) => {
            const rating: BoxrecRating = new BoxrecPageRatingsRow(val);
            ratingsList.push(rating);
        });

        return ratingsList;
    }

    private parseRatings(): void {
        const tr = $("#ratingsResults tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html = $(elem).html() || "";
            this._ratings.push(html);
        });
    }

}
