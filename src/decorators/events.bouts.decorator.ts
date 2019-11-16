import {BoxrecDateEvent} from "../boxrec-pages/date/boxrec.date.event";
import {BoxrecPageEvent} from "../boxrec-pages/event/boxrec.page.event";

/**
 * Adds a getter to the class that returns the events section of a table
 * This events getter is for pages that have bouts listed underneath
 * like you'd find on a date page, or schedule page
 * @param classType the passed in class type that will be initialized and returned
 * @constructor
 */
export function EventsBoutsGetter(classType: (new (event: string) => any)):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "events", {
            get<T>(): T[] {
                const el: Cheerio = this.$(".calendarTable:nth-child(1) thead:nth-child(2)");
                const headers: string = `<thead>${el.html()}</thead>`;

                return this.parse(headers).map((event: string) => new classType(event));
            },
        });
    };
}

export interface EventsBoutsInterface {
    readonly events: BoxrecPageEvent[] | BoxrecDateEvent[];
}
