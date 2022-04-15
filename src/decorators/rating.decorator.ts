import {BoxrecCommonTablesColumnsClass} from '../boxrec-common-tables/boxrec-common-tables-columns.class';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../helpers';

/**
 * Adds a getter to the class that returns the rating for this bout
 * @constructor
 */
export function RatingGetter():
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'rating', {
            get(): number | null {
                /**
                 * todo duplication occurring
                 * need a place to store these BoxRec classes or better yet find a single entry point
                 */
                const fullStarClassName: string = '.fa-star';
                const halfStarClassName: string = '.fa-half-star';
                return BoxrecCommonTablesColumnsClass.parseRating(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.rating, true), fullStarClassName, halfStarClassName);
            },
        });
    };
}

export interface RatingInterface {
    readonly rating: number | null;
}
