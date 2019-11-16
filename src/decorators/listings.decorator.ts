import {BoxrecPageLocationEventRow} from "../boxrec-pages/location/event/boxrec.page.location.event.row";
import {BoxrecPageLocationBoxerRow} from "../boxrec-pages/location/people/boxrec.page.location.boxer.row";
import {BoxrecPageLocationPeopleRow} from "../boxrec-pages/location/people/boxrec.page.location.people.row";
import {BoxrecPageProfileEventRow} from "../boxrec-pages/profile/boxrec.page.profile.event.row";
import {BoxrecPageVenueEventsRow} from "../boxrec-pages/venue/boxrec.page.venue.events.row";
import {getHeaderColumnText} from "../helpers";

/**
 * Adds a getter to the class that returns the listings of a table
 * The getter that is added is for pages that have single listings
 * like you'd find on a venue page, or profile pages (judges, matchmaker, etc.), location of boxers/people
 * @param getter    what the getter will be for the class
 * @param classType the passed in class type that will be initialized and returned
 * @param tableEl   the table element to search data for
 * @constructor
 */
export function ListingsGetter(getter: string,
                               classType: (new (headerColumns: string[], item: string) => any), tableEl: string):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, getter, {
            /**
             * Returns a list of events/listings
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

export interface ListingsInterface {
    readonly events?: BoxrecPageProfileEventRow[] | BoxrecPageVenueEventsRow[] | BoxrecPageLocationEventRow[];
    readonly people?: BoxrecPageLocationBoxerRow[] | BoxrecPageLocationPeopleRow[];
}
