import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../helpers";

export function DayGetter(): (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "day", {
            get(): string {
                return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.day, false);
            },
        });
    };
}

export interface DayInterface {
    readonly day: string;
}
