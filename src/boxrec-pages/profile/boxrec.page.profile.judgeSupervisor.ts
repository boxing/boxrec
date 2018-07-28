import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileJudgeSupervisorBoutRow} from "./boxrec.page.profile.judgeSupervisor.bout.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * BoxRec Judge/Supervisor Profile Page
 * <pre>ex. http://boxrec.com/en/judge/401002</pre>
 * <pre>ex. http://boxrec.com/en/supervisor/406714</pre>
 */
export class BoxrecPageProfileJudgeSupervisor extends BoxrecPageProfile {

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        super.parseName();
        super.parseProfileTableData();
        this.parseBouts();
    }

    /**
     * Returns the bouts information for the judge/supervisor
     * is order from most recent to oldest
     * the number of columns is different of a boxer
     * @returns {BoxrecPageProfileJudgeSupervisorBoutRow[]}
     */
    get bouts(): BoxrecPageProfileJudgeSupervisorBoutRow[] {
        return super.getBouts(BoxrecPageProfileJudgeSupervisorBoutRow);
    }

    protected parseBouts(): void {
        const tr: Cheerio = $("#listBoutsResults tbody tr");
        super.parseBouts(tr);
    }

}
