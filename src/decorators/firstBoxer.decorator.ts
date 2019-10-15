import {BoxrecBasic} from "boxrec-requests/dist/boxrec-requests.constants";
import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

export function FirstBoxer(): (target: any) => void {
    // tslint:disable
    return function(target) {
        Object.defineProperty(target.prototype, "firstBoxer", {
            get: function() {
                return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$, this.headerColumns,
                    BoxrecCommonTableHeader.fighter));
            },
        });
    };
}

export interface FirstBoxerInterface {
    readonly firstBoxer: BoxrecBasic;
}
