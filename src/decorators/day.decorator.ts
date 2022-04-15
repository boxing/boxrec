import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../helpers';

/**
 * Adds a getter to the class that returns the day column and parses it
 * @constructor
 */
export function DayGetter(): (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'day', {
            get(): string {
                return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.day, false);
            },
        });
    };
}

export interface DayInterface {
    readonly day: string;
}
