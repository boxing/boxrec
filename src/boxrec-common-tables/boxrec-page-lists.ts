import * as cheerio from "cheerio";
import {BoxrecPageLocationPeopleRow} from "../boxrec-pages/location/people/boxrec.page.location.people.row";
import {stripCommas} from "../helpers";

export abstract class BoxrecPageLists {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get numberOfPages(): number {
        return this.getNumberOfPages();
    }

    protected getNumberOfPages(): number {
        const text: string = this.$(".pagerResults").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

    protected getTableData<U>(classType: (new (item: string) => U)): U[] {
        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get()
            .map(item => new classType(item));
    }

}