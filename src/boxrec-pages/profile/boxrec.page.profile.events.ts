import {getHeaderColumnText} from "../../helpers";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileEventsOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";

const tableEl: string = ".dataTable";

/**
 * Parses profiles that have events listed
 */
export class BoxrecPageProfileEvents extends BoxrecPageProfile {

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns {BoxrecPageProfileEventRow[]}
     */
    get events(): BoxrecPageProfileEventRow[] {
        const headerColumns: string[] = getHeaderColumnText(this.$(tableEl));

        return this.$(tableEl).find("tbody tr")
            .map((index: number, elem: CheerioElement) => this.$(elem).html() || "")
            .get() // Cheerio -> string[]
            .map(item => new BoxrecPageProfileEventRow(headerColumns, item));
    }

    get output(): BoxrecProfileEventsOutput {
        return {
            birthName: this.birthName,
            birthPlace: this.birthPlace,
            events: this.events,
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
