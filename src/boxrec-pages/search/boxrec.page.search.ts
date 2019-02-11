import {BoxrecSearchOutput} from "@boxrec-pages/search/boxrec.page.search.constants";
import {BoxrecPageSearchRow} from "@boxrec-pages/search/boxrec.page.search.row";
import {BoxrecSearch} from "@boxrec-pages/search/boxrec.search.constants";
import * as cheerio from "cheerio";

/**
 * parse a BoxRec Search Results page
 * <pre>ex. http://boxrec.com/en/search?pf%5Bfirst_name%5D=floyd&pf%5Blast_name%5D=mayweather+jr&pf%5Brole%5D=boxer&pf%5Bstatus%5D=&pf_go=&pf%5BorderBy%5D=&pf%5BorderDir%5D=ASC</pre>
 */
export class BoxrecPageSearch {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get output(): BoxrecSearchOutput {
        return {
            results: this.results,
        };
    }

    get results(): BoxrecSearch[] {
        return this.parse().map(item => new BoxrecPageSearchRow(item));
    }

    private parse(): string[] {
        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get();
    }

}
