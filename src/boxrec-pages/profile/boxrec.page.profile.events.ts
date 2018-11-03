import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");

/**
 * Parses profiles that have events listed
 */
export class BoxrecPageProfileEvents extends BoxrecPageProfile {

    protected readonly $: CheerioStatic;
    // found on promoter page
    private _company: string;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
        super.parseProfileTableData();
    }

    get company(): string | null {
        const company: string | void = this.parseProfileTableData(BoxrecProfileTable.company);

        if (company) {
            return company;
        }

        return null;
    }

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns {BoxrecPageProfileEventRow[]}
     */
    get events(): BoxrecPageProfileEventRow[] {
        const events: string[] = this.parseEvents();
        const boutsList: BoxrecPageProfileEventRow[] = [];
        events.forEach((val: string) => boutsList.push(new BoxrecPageProfileEventRow(val)));

        return boutsList;
    }

    private parseEvents(): string[] {
        const tr: Cheerio = this.$("#listShowsResults tbody tr");
        const eventsList: string[] = [];

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            eventsList.push(html);
        });

        return eventsList;
    }

}
