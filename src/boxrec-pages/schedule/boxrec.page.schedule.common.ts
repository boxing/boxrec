import * as cheerio from "cheerio";
import {trimRemoveLineBreaks} from "../../helpers";

export abstract class BoxrecPageScheduleCommon {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * Parses different table formats into a way we can parse the information out of the table further
     * @param headerColumns the header column values passed in from the parent to add to all tables, these
     *                      contain the column values i.e. division, outcome, etc.
     * @returns             an array of event tables in string format
     */
    protected parse(headerColumns: string): string[] {
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
                event += `<thead>${el.html()}</thead>`;
                // and then add the "header columns values" we pass in to add a row of the values
                event += headerColumns;
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
