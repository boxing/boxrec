import * as cheerio from "cheerio";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";

export class BoxrecPageProfileManager extends BoxrecPageProfile {

    protected readonly $: CheerioStatic;

    /**
     * When instantiated the HTML for this page needs to be supplied
     * @param {string} boxrecBodyString     the HTML of the profile page
     * @param {string} boxrecBodyString     the HTML of the profile page
     */
    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxers(): BoxrecPageProfileManagerBoxerRow[] {
        return this.$("#listManagedBoxers tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get()
            .map(item => new BoxrecPageProfileManagerBoxerRow(item));
    }
}
