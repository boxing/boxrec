import {BoxrecPageLists} from "@boxrec-common-tables/boxrec-page-lists";
import {BoxrecRatingsOutput} from "@boxrec-pages/ratings/boxrec.ratings.constants";
import * as cheerio from "cheerio";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

/**
 * parse a BoxRec Ratings Page
 * <pre>ex. http://boxrec.com/en/ratings</pre>
 */
export class BoxrecPageRatings extends BoxrecPageLists {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxers(): BoxrecPageRatingsRow[] {
        return this.parseRatings().map(item => new BoxrecPageRatingsRow(item));
    }

    get output(): BoxrecRatingsOutput {
        return {
            boxers: this.boxers,
            numberOfPages: this.numberOfPages,
        };
    }

    private parseRatings(): string[] {
        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get();
    }

}
