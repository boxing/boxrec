import {BoxrecBasic} from "boxrec-requests";
import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the first boxer for that table row
 * @constructor
 */
export function FirstBoxerGetter(): (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "firstBoxer", {
            get(): BoxrecBasic {
                return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.fighter));
            },
        });
    };
}

export interface FirstBoxerInterface {
    readonly firstBoxer: BoxrecBasic;
}
