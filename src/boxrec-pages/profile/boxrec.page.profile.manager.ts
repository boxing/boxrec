import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileManager extends BoxrecPageProfile {

    private _boxersList: string[] = [];

    /**
     * When instantiated the HTML for this page needs to be supplied
     * @param {string} boxrecBodyString     the HTML of the profile page
     * @param {string} boxrecBodyString     the HTML of the profile page
     */
    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        super.parseProfileTableData();
        this.parseBoxers();
    }

    get boxers(): BoxrecPageProfileManagerBoxerRow[] {
        const boxers: string[] = this._boxersList;
        const boxersList: BoxrecPageProfileManagerBoxerRow[] = [];
        boxers.forEach((val: string) => boxersList.push(new BoxrecPageProfileManagerBoxerRow(val)));

        return boxersList;
    }

    private parseBoxers(): void {
        const tr: Cheerio = $("#listManagedBoxers tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._boxersList.push(html);
        });
    }

}
