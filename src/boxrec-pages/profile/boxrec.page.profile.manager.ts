import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";

const cheerio: CheerioAPI = require("cheerio");

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
        super.parseProfileTableData();
    }

    get boxers(): BoxrecPageProfileManagerBoxerRow[] {
        const boxers: string[] = this.parseBoxers();
        const boxersList: BoxrecPageProfileManagerBoxerRow[] = [];
        boxers.forEach((val: string) => boxersList.push(new BoxrecPageProfileManagerBoxerRow(val)));

        return boxersList;
    }

    private parseBoxers(): string[] {
        const tr: Cheerio = this.$("#listManagedBoxers tbody tr");
        const boxersList: string[] = [];

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            boxersList.push(html);
        });

        return boxersList;
    }

}
