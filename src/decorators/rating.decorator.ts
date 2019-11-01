import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the rating for this bout
 * @constructor
 */
export function RatingGetter():
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "rating", {
            get(): number | null {
                return BoxrecCommonTablesColumnsClass.parseRating(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.rating, true));
            },
        });
    };
}

export interface RatingInterface {
    readonly rating: number | null;
}
