import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {WinLossDraw} from "../boxrec-pages/boxrec.constants";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the first last 6
 * @constructor
 */
export function Last6Getter():
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "last6", {
            get(): WinLossDraw[] {
                return BoxrecCommonTablesColumnsClass.parseLast6Column(
                    getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.firstLast6));
            },
        });
    };
}

export interface Last6Interface {
    readonly last6?: WinLossDraw[];
}
