import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the weight of the first boxer
 * @param boxer    which boxer this decorator is for
 * @constructor
 */
export function WeightGetter(boxer: "firstBoxerWeight" | "secondBoxerWeight" = "firstBoxerWeight"):
    (target: any) => void {
    const column: BoxrecCommonTableHeader = boxer === "firstBoxerWeight" ? BoxrecCommonTableHeader.firstFighterWeight :
        BoxrecCommonTableHeader.secondFighterWeight;
    return target => {
        Object.defineProperty(target.prototype, boxer, {
            get(): number | null {
                return BoxrecCommonTablesColumnsClass.parseWeight(
                    getColumnDataByColumnHeader(this.$, this.headerColumns, column, false));
            },
        });
    };
}

export interface BoxerWeightInterface {
    readonly firstBoxerWeight?: number | null;
    readonly secondBoxerWeight?: number | null;
}
