import * as cheerio from "cheerio";
import {stripCommas} from "../../helpers";
import {BoxrecParseBouts} from "../event/boxrec.parse.bouts";
import {BoxrecTitlesOutput} from "./boxrec.page.title.constants";
import {BoxrecPageTitlesRow} from "./boxrec.page.titles.row";

/**
 * parse a BoxRec Titles page (different from Title page)
 * <pre>ex. http://boxrec.com/en/titles?WcX%5Bbout_title%5D=72&WcX%5Bdivision%5D=Super+Middleweight&t_go=</pre>
 */
export class BoxrecPageTitles extends BoxrecParseBouts {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get bouts(): BoxrecPageTitlesRow[] {
        return this.parseBouts().map((val: [string, string | null]) => new BoxrecPageTitlesRow(val[0], val[1]));
    }

    get numberOfPages(): number {
        const text: string = this.$(".filterBarFloat .pagerElement:nth-last-child(3)").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

    get output(): BoxrecTitlesOutput {
        return {
            bouts: this.bouts,
            numberOfBouts: this.numberOfBouts,
            numberOfPages: this.numberOfPages,
        };
    }

}
