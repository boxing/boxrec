import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileOtherOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileOtherCommonBoutRow} from "./boxrec.page.profile.other.common.bout.row";
import {BoutsGetter} from "../../decorators/bouts.decorator";

/**
 * BoxRec Judge/Supervisor Profile Page
 * <pre>ex. http://boxrec.com/en/judge/401002</pre>
 * <pre>ex. http://boxrec.com/en/supervisor/406714</pre>
 */
@BoutsGetter("table", BoxrecPageProfileOtherCommonBoutRow)
export class BoxrecPageProfileOtherCommon extends BoxrecPageProfile {

    /**
     * Returns the bouts information for the judge/supervisor
     * is order from most recent to oldest
     * the number of columns is different of a boxer
     * @returns {BoxrecPageProfileOtherCommonBoutRow[]}
     */
    bouts: BoxrecPageProfileOtherCommonBoutRow[];

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
