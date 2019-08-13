import * as cheerio from "cheerio";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileEventsOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";

/**
 * Parses profiles that have events listed
 */
export class BoxrecPageProfileEvents extends BoxrecPageProfile {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns {BoxrecPageProfileEventRow[]}
     */
    get events(): BoxrecPageProfileEventRow[] {
        return this.$(".dataTable tbody tr")
            .map((index: number, elem: CheerioElement) => this.$(elem).html() || "")
            .get() // Cheerio -> string[]
            .map(item => new BoxrecPageProfileEventRow(item));
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
