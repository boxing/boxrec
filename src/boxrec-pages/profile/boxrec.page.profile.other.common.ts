import {BoxrecProfileOtherOutput} from "@boxrec-pages/profile/boxrec.page.profile.constants";
import * as cheerio from "cheerio";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileOtherCommonBoutRow} from "./boxrec.page.profile.other.common.bout.row";

/**
 * BoxRec Judge/Supervisor Profile Page
 * <pre>ex. http://boxrec.com/en/judge/401002</pre>
 * <pre>ex. http://boxrec.com/en/supervisor/406714</pre>
 */
export class BoxrecPageProfileOtherCommon extends BoxrecPageProfile {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * Returns the bouts information for the judge/supervisor
     * is order from most recent to oldest
     * the number of columns is different of a boxer
     * @returns {BoxrecPageProfileOtherCommonBoutRow[]}
     */
    get bouts(): BoxrecPageProfileOtherCommonBoutRow[] {
        const boutsList: Array<[string, string | null]> = super.parseBouts(this.$("#listBoutsResults tbody tr"));
        return super.getBouts(boutsList, BoxrecPageProfileOtherCommonBoutRow);
    }

    get output(): BoxrecProfileOtherOutput {
        return {
            birthName: this.birthName,
            birthPlace: this.birthPlace,
            bouts: this.bouts,
            globalId: this.globalId,
            name: this.name,
            otherInfo: this.otherInfo,
            picture: this.picture,
            residence: this.residence,
            role: this.role,
            status: this.status,
        };
    }

}
