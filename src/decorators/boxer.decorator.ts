import {BoxrecBasic} from "boxrec-requests/dist/boxrec-requests.constants";
import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the first/opponent boxer for that table row
 * @constructor
 */
export function BoxerGetter(column: "firstBoxer" | "secondBoxer" = "firstBoxer"): (target: any) => void {
    return target => {
        const tableHeader: BoxrecCommonTableHeader = column === "firstBoxer" ? BoxrecCommonTableHeader.fighter :
            BoxrecCommonTableHeader.opponent;
        Object.defineProperty(target.prototype, column, {
            get(): BoxrecBasic {
                return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, tableHeader));
            },
        });
    };
}

export interface BoxerInterface {
    readonly firstBoxer: BoxrecBasic;
    readonly secondBoxer?: BoxrecBasic;
}
