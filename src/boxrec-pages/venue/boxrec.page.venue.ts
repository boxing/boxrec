import {trimRemoveLineBreaks} from "../../helpers";
import {Location} from "../boxrec.constants";
import {BoxrecPageVenueEventsRow} from "./boxrec.page.venue.events.row";

const cheerio: CheerioAPI = require("cheerio");

/**
 * parse a BoxRec Venue page
 * <pre>ex. http://boxrec.com/en/venue/38555</pre>
 */
export class BoxrecPageVenue {

    private $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * Returns an array of events
     * @returns {BoxrecPageVenueEventsRow[]} is in order of the page, events may have been inserted into BoxRec and the IDs will not always be in order
     */
    get events(): BoxrecPageVenueEventsRow[] {
        return this.parseEvents().map(item => new BoxrecPageVenueEventsRow(item));
    }

    // we're going to return the first event that has the Location object
    // that's assuming that there's no venues on BoxRec with no event associated with it

    /**
     * Returns an array of boxers that are in the area
     * @returns {Object}  could use BoxrecBasic but this shouldn't return null values, so using `{ id: string, name: string }[]`
     */
    get localBoxers(): Array<{ id: number, name: string }> {
        return this.parseBasicInfo("boxer");
    }

    /**
     * Returns an array of managers that operate in this area
     * @returns {Object}  could use BoxRecBasic but this shouldn't return null values, so using `{ id: string, name: string }[]`
     */
    get localManagers(): Array<{ id: number, name: string }> {
        return this.parseBasicInfo("manager");
    }

    // worst case scenario we could just return the string of the location
    get location(): Location {
        return this.events[0].location;
    }

    get name(): string {
        return trimRemoveLineBreaks(this.$("h1").text());
    }

    private parseBasicInfo(type: "manager" | "boxer"): Array<{ id: number, name: string }> {
        const links: Cheerio = this.$(".filterBarFloat div:nth-child(2) a");
        const results: Array<{ id: number, name: string }> = [];

        links.each((i: number, elem: CheerioElement) => {
            const href: string = this.$(elem).attr("href");
            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);
            let person: { id: number, name: string } | null = null;

            if (matches && matches[1]) {
                person = {
                    id: parseInt(matches[1], 10),
                    name: trimRemoveLineBreaks(this.$(elem).text()),
                };

                if (href.includes(type)) {
                    results.push(person);
                }
            }
        });

        return results;
    }

    private parseEvents(): string[] {
        const events: string[] = [];
        const tr: Cheerio = this.$("#eventsTable tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            events.push(html);
        });

        return events;
    }

}
