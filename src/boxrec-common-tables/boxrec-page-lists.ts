import * as cheerio from "cheerio";
import {getHeaderColumnText, stripCommas} from "../helpers";

export abstract class BoxrecPageLists {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get numberOfPages(): number {
        const text: string = this.$(".pagerResults").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

    protected getTableData<U>(classType: (new (headerColumns: string[], item: string) => U)): U[] {
        const headerColumns: string[] = getHeaderColumnText(this.$(".dataTable"));

        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get()
            .map(item => new classType(headerColumns, item));
    }

}
