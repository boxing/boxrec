import {BoxrecRating} from "../boxrec.constants";
import {BoxrecPageRatingsRating} from "./boxrec.page.ratings.rating";

const cheerio = require("cheerio");
let $: CheerioAPI;

/**
 * Parse a Boxrec Ratings Results Page
 */
export class BoxrecPageRatings {

    private _ratings: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseRatings();
    }

    get get(): BoxrecRating[] {
        const ratings = this._ratings;
        let ratingsList: BoxrecRating[] = [];

        ratings.forEach((val: string) => {
            const rating: BoxrecRating = new BoxrecPageRatingsRating(val).get;
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
