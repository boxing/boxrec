import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Parses profiles that have events listed
 */
export class BoxrecPageProfileEvents extends BoxrecPageProfile {

    // found on promoter page
    private _company: string;
    private _eventsList: string[] = [];

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        super.parseName();
        super.parseProfileTableData();
        this.parseEvents();
    }

    get company(): string {
        return this._company;
    }

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns {BoxrecPageProfileEventRow[]}
     */
    get events(): BoxrecPageProfileEventRow[] {
        const events: string[] = this._eventsList;
        const boutsList: BoxrecPageProfileEventRow[] = [];
        events.forEach((val: string) => boutsList.push(new BoxrecPageProfileEventRow(val)));

        return boutsList;
    }

    private parseEvents(): void {
        const tr: Cheerio = $("#listShowsResults tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._eventsList.push(html);
        });
    }

}