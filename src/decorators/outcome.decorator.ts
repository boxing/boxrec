import {BoxrecCommonTablesColumnsClass} from '../boxrec-common-tables/boxrec-common-tables-columns.class';
import {WinLossDraw} from '../boxrec-pages/boxrec.constants';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../helpers';

/**
 * Adds a getter to the class that returns the outcome for this bout
 * @param columnHeaderText  the column header text to search for (needs to be checked for consistency?)
 * @param returnHTML    whether to return HTML or not
 * @constructor
 */
export function OutcomeGetter(columnHeaderText: BoxrecCommonTableHeader = BoxrecCommonTableHeader.outcome,
                              returnHTML: boolean = false):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'outcome', {
            get(): WinLossDraw | null {
                return BoxrecCommonTablesColumnsClass.parseOutcome(
                    getColumnDataByColumnHeader(this.$, this.headerColumns, columnHeaderText, returnHTML));
            },
        });
    };
}

export interface OutcomeInterface {
    readonly outcome: WinLossDraw | null;
}
