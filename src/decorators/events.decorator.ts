import {getHeaderColumnText} from "../helpers";
import {BoxrecPageProfileEventRow} from "../boxrec-pages/profile/boxrec.page.profile.event.row";
import {BoxrecPageVenueEventsRow} from "../boxrec-pages/venue/boxrec.page.venue.events.row";

export function EventsGetter(classType: (new (headerColumns: string[], item: string) => any), tableEl: string):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "events", {
            /**
             * Returns a list of events
             * is order from most recent to oldest
             * @returns array of passed in class
             */
            get<T>(): T[] {
                const headerColumns: string[] = getHeaderColumnText(this.$(tableEl));

                return this.$(tableEl).find("tbody tr")
                    .map((index: number, elem: CheerioElement) => this.$(elem).html() || "")
                    .get() // Cheerio -> string[]
                    .map((item: string) => new classType(headerColumns, item));
            },
        });
    };
}

export interface EventsInterface {
    readonly events: BoxrecPageProfileEventRow[] | BoxrecPageVenueEventsRow[];
}
