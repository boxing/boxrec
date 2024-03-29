import {BoxrecCommonTablesColumnsClass} from '../boxrec-common-tables/boxrec-common-tables-columns.class';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../helpers';

/**
 * Adds a getter to the class that returns the id for that table row
 * @constructor
 */
export function IdGetter(commonId: BoxrecCommonTableHeader.name | BoxrecCommonTableHeader.links
                             = BoxrecCommonTableHeader.name):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'id', {
            get(): number {
                return BoxrecCommonTablesColumnsClass.parseId(
                    getColumnDataByColumnHeader(this.$, this.headerColumns,
                        BoxrecCommonTableHeader[commonId])) as number;
            },
        });
    };
}

export interface IdInterface {
    readonly id: number;
}
