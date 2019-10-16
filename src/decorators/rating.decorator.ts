import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

export function RatingGetter(returnHTML: boolean = false):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "rating", {
            get(): number | null {
                return BoxrecCommonTablesColumnsClass.parseRating(getColumnDataByColumnHeader(this.$, this.headerColumns,
                    BoxrecCommonTableHeader.rating, returnHTML));
            },
        });
    };
}

export interface RatingInterface {
    readonly rating: number | null;
}
