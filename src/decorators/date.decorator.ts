import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../helpers";

/**
 * Adds a getter to the class that returns the date column data
 * @constructor
 */
export function DateGetter(): (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "date", {
            get(): string {
                return trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.date, false));
            },
        });
    };
}

export interface DateInterface {
    readonly date: string;
}
