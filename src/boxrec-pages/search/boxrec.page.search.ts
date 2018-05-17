import {BoxrecSearch} from "../boxrec.constants";
import {BoxrecPageSearchBoxerRow} from "./boxrec.page.search-boxer.row";

const cheerio = require("cheerio");
let $: CheerioAPI;

/**
 * Parse boxrec Search Results page
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
