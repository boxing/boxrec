import * as cheerio from "cheerio";
import {getHeaderColumnText} from "../../helpers";
import {BoxrecPageSearchRow} from "./boxrec.page.search.row";
import {BoxrecPageSearchOutput} from "./boxrec.search.constants";

/**
 * parse a BoxRec Search Results page
 * <pre>ex. http://boxrec.com/en/search?pf%5Bfirst_name%5D=floyd&pf%5Blast_name%5D=mayweather+jr&pf%5Brole%5D=boxer&pf%5Bstatus%5D=&pf_go=&pf%5BorderBy%5D=&pf%5BorderDir%5D=ASC</pre>
 */
export class BoxrecPageSearch {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get output(): BoxrecPageSearchOutput {
        return {
            results: this.results.map(result => result.output),
        };
    }

    get results(): BoxrecPageSearchRow[] {
        const headerColumns: string[] = getHeaderColumnText(this.$(".dataTable"));

        return this.parse().map(item => new BoxrecPageSearchRow(headerColumns, item));
    }

    private parse(): string[] {
        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get();
    }

}
