import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecLocation} from "../boxrec-pages/boxrec.constants";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the location
 * @constructor
 */
export function LocationGetter(linkToLookAt: number = 0):
    (target: any) => void {
    return (target: any) => {
        Object.defineProperty(target.prototype, "location", {
            get(): BoxrecLocation {
                return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.location), linkToLookAt);
            },
        });
    };
}
