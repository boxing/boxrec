import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {Record} from "../boxrec-pages/boxrec.constants";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../helpers";

/**
 * Adds a getter to the class that returns the record
 * @constructor
 */
export function RecordGetter():
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "record", {
            get(): Record {
                return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.record));
            },
        });
    };
}

export interface RecordInterface {
    readonly record: Record;
}
