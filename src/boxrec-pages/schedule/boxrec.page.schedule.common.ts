import * as cheerio from "cheerio";
import {trimRemoveLineBreaks} from "../../helpers";

export abstract class BoxrecPageScheduleCommon {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * Parses different table formats into a way we can parse the information out of the table further
     * @param headerLocationFirst if true the header information we require is the first thead element
     */
    protected parse(headerLocationFirst: boolean = false): string[] {
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
                if (headerLocationFirst && i === 1) {
                    event += `<thead>${el.html()}</thead>`;
                } else if (i !== 1) {
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
