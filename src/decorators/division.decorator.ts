import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {WeightDivision} from "../boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the division column and parses it
 * @constructor
 */
export function DivisionGetter(): (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "division", {
            get(): WeightDivision | null {
                return BoxrecCommonTablesColumnsClass.parseDivision(getColumnDataByColumnHeader(this.$,
                    this.headerColumns,
                    BoxrecCommonTableHeader.division, false));
            },
        });
    };
}

export interface DivisionInterface {
    readonly division: WeightDivision | null;
}
