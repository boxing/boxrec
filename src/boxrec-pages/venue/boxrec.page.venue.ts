import {BoxrecBasic, Location} from "../boxrec.constants";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageVenueEventsRow} from "./boxrec.page.venue.events.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * parse a BoxRec Venue page
 * <pre>ex. http://boxrec.com/en/venue/38555</pre>
 */
export class BoxrecPageVenue {

    private _name: string;
    private _localBoxers: { id: number, name: string }[] = [];
    private _localManagers: { id: number, name: string }[] = [];
    private _events: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);

        this.parseBasicInfo();
        this.parseEvents();
    }

    get name(): string {
        return trimRemoveLineBreaks(this._name);
    }

    // we're going to return the first event that has the Location object
    // that's assuming that there's no venues on BoxRec with no event associated with it
    // worst case scenario we could just return the string of the location
    get location(): Location {
        return this.events[0].location;
    }

    /**
     * Returns an array of events
     * @returns {BoxrecPageVenueEventsRow[]} is in order of the page, events may have been inserted into BoxRec and the IDs will not always be in order
     */
    get events(): BoxrecPageVenueEventsRow[] {
        return this._events.map(item => new BoxrecPageVenueEventsRow(item));
    }

    /**
     * Returns an array of boxers that are in the area
     * @returns {Object}  could use BoxrecBasic but this shouldn't return null values, so using `{ id: string, name: string }[]`
     */
    // todo what scenarios are there where BoxrecBasic will return null?
    get localBoxers(): { id: number, name: string }[] {
        return this._localBoxers;
    }

    /**
     * Returns an array of managers that operate in this area
     * @returns {Object}  could use BoxRecBasic but this shouldn't return null values, so using `{ id: string, name: string }[]`
     */
    get localManagers(): { id: number, name: string }[] {
        return this._localManagers;
    }

    private parseBasicInfo(): void {
        this._name = $("h1").text();
        const links: Cheerio = $(".filterBarFloat div:nth-child(2) a");

        links.each((i: number, elem: CheerioElement) => {
            const href: string = $(elem).attr("href");
            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);
            let person: { id: number, name: string } | null = null;

            if (matches && matches[1]) {
                person = {
                    id: parseInt(matches[1], 10),
                    name: trimRemoveLineBreaks($(elem).text()),
                };

                if (href.includes("boxer")) {
                    this._localBoxers.push(person);
                } else if (href.includes("manager")) {
                    this._localManagers.push(person);
                }
            }
        });
    }

    private parseEvents(): void {
        const tr: Cheerio = $("#eventsTable tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._events.push(html);
        });
    }

}