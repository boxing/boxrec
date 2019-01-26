import * as cheerio from "cheerio";
import {BoxrecParseBoutsParseBouts} from "./boxrec.parse.bouts.parseBouts";

export abstract class BoxrecParseBouts extends BoxrecParseBoutsParseBouts {

    protected $: CheerioStatic;

    protected constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    protected parseBouts(): Array<[string, string | null]> {
        return this.returnBouts(this.$("tbody tr"));
    }

    get numberOfBouts(): number {
        const text: string = this.$(".pagerResults").text() || "0";
        return parseInt(text, 10);
    }

}
