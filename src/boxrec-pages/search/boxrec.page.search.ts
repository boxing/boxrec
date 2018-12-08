import * as cheerio from "cheerio";
import {BoxrecPageSearchRow} from "./boxrec.page.search.row";
import {BoxrecSearch} from "./boxrec.search.constants";

/**
 * parse a BoxRec Search Results page
 * <pre>ex. http://boxrec.com/en/search?pf%5Bfirst_name%5D=floyd&pf%5Blast_name%5D=mayweather+jr&pf%5Brole%5D=boxer&pf%5Bstatus%5D=&pf_go=&pf%5BorderBy%5D=&pf%5BorderDir%5D=ASC</pre>
 */
export class BoxrecPageSearch {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get results(): BoxrecSearch[] {
        return this.parse().map(item => new BoxrecPageSearchRow(item));
    }

    // takes the search page HTML and gets the dynamic param from the "Find People" box
    get searchBoxParam(): string {
        // lazy search in case the structure changes
        return this.$("h2:contains('Find People')").parents("td").find("form").attr("name");
    }

    private parse(): string[] {
        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get();
    }

}
