import * as cheerio from "cheerio";
import {stripCommas} from "../helpers";

export abstract class BoxrecPageLists {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get numberOfPages(): number {
        const text: string = this.$(".pagerResults").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

}
