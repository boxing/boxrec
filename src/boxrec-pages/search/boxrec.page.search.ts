import {BoxrecSearch} from "../boxrec.constants";
import {BoxrecPageSearchBoxerRow} from "./boxrec.page.search-boxer.row";

const cheerio = require("cheerio");
let $: CheerioAPI;

/**
 * parse a BoxRec Search Results page
 * ex. http://boxrec.com/en/search?pf%5Bfirst_name%5D=floyd&pf%5Blast_name%5D=mayweather+jr&pf%5Brole%5D=boxer&pf%5Bstatus%5D=&pf_go=&pf%5BorderBy%5D=&pf%5BorderDir%5D=ASC
 */
export class BoxrecPageSearch {

    private _searchResults: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parse();
    }

    get output(): BoxrecSearch[] {
        const searchResults: string[] = this._searchResults;
        let searchResultsList: BoxrecSearch[] = [];
        searchResults.forEach((val: string) => {
            const searchRow: BoxrecSearch = new BoxrecPageSearchBoxerRow(val);
            searchResultsList.push(searchRow);
        });

        return searchResultsList;
    }

    private parse() {
        const tr = $("#searchResults tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html = $(elem).html() || "";
            this._searchResults.push(html);
        });
    }

}
