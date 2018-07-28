import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageEvent} from "../event/boxrec.page.event";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * BoxRec Results/Schedule Page
 * <pre>ex. http://boxrec.com/en/schedule?c%5BcountryCode%5D=&c%5Bdivision%5D=Light+Middleweight&c%5Btv%5D=&c_go=</pre>
 * <pre>ex. http://boxrec.com/en/results?c%5BcountryCode%5D=US&c%5Bdivision%5D=Middleweight&c_go=</pre>
 */
export class BoxrecPageSchedule {

    private _events: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parse();
    }

    get events(): BoxrecPageEvent[] {
        const events: BoxrecPageEvent[] = [];

        for (const event of this._events) {
            const parsedEvent: BoxrecPageEvent = new BoxrecPageEvent(event);
            events.push(parsedEvent);
        }

        return events;
    }

    private parse(): void {
        // this is set up incredibly strange on BoxRec
        // so it's just a giant slew of `thead` and `tbody`
        // loop through, if `thead`, it's the new schedule
        // the last `tbody` before a `thead` is empty
        const tableChildren: Cheerio = $("table#calendarSchedule > *");
        let event: string = "";

        tableChildren.each((i: number, elem: CheerioElement) => {
            const el: Cheerio = $(elem);
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
                    this._events.push(`<table id="eventResults">${event}</table>`); // end of event
                    event = ""; // reset
                }
            }

        });
    }

}
