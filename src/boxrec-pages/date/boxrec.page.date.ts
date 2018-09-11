import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecDateEvent} from "./boxrec.date.event";

const cheerio: CheerioAPI = require("cheerio");

/**
 * Parse a BoxRec date page
 */
export class BoxrecPageDate {

    private $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get events(): BoxrecDateEvent[] {
        return this.parse().map((event: string) => new BoxrecDateEvent(event));
    }


    // todo duplicate, stolen from `schedule`
    // todo uses `calendarDate` for table
    private parse(): string[] {
        // this is set up incredibly strange on BoxRec
        // so it's just a giant slew of `thead` and `tbody`
        // loop through, if `thead`, it's the new schedule
        // the last `tbody` before a `thead` is empty
        const tableChildren: Cheerio = this.$(".calendarTable > *");
        let event: string = "";
        const events: string[] = [];

        tableChildren.each((i: number, elem: CheerioElement) => {
            const el: Cheerio = this.$(elem);
            const tagName: string = el.get(0).tagName; // this will either be `thead` or `tbody`

            if (tagName === "thead") { // is the date, location, event, wiki
                if (i !== 1) { // `1` is the column headers `division`, `boxer`, etc. ignore it
                    event += `<thead>${el.html()}</thead>`;
                }
            } else { // are the bouts, or just an empty space to break up the content
                // we check content length because there's an empty `tbody` before the next event
                const contentLength: number = trimRemoveLineBreaks(el.text() || "").length;

                if (contentLength) {
                    event += `<tbody>${el.html()}</tbody>`;
                } else {
                    // wrap with `eventResults` to work with the events class
                    events.push(`<table id="eventResults">${event}</table>`); // end of event
                    event = ""; // reset
                }
            }
        });

        return events;
    }

}
