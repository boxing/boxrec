import * as cheerio from "cheerio";
import {BoxrecParseBoutsParseBouts} from "./boxrec.parse.bouts.parseBouts";

export abstract class BoxrecParseBouts extends BoxrecParseBoutsParseBouts {

    protected $: CheerioStatic;

    protected constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * If less than 25 (24 per page), we have to figure out the number a different way
     */
    get numberOfBouts(): number {
        const numberOfBoutsEl: Cheerio = this.$(".pagerResults");
        if (numberOfBoutsEl.length) {
            const text: string = numberOfBoutsEl.text() || "0";
            return parseInt(text, 10);
        }

        // count the number of table rows, this should only occur if total number of bouts is less than the max per page
        const tableEl: Cheerio = this.$(".dataTable");

        if (tableEl.length) {
            return tableEl.find("tbody").length;
        }

        return 0;
    }

    protected parseBouts(): Array<[string, string | null]> {
        return this.returnBouts(this.$("tbody tr"));
    }

}
