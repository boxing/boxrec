import {BoxrecCommonTablesColumnsClass} from '../boxrec-common-tables/boxrec-common-tables-columns.class';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../helpers';

/**
 * Adds a getter to the class that returns the weight of the first boxer
 * @param returnHTML    whether to return HTML or not
 * @constructor
 */
export function FirstBoxerWeightGetter(returnHTML: boolean = false):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'firstBoxerWeight', {
            get(): number | null {
                return BoxrecCommonTablesColumnsClass.parseWeight(
                    getColumnDataByColumnHeader(this.$, this.headerColumns,
                        BoxrecCommonTableHeader.firstFighterWeight, false));
            },
        });
    };
}

export interface FirstBoxerWeightInterface {
    readonly firstBoxerWeight: number | null;
}
