import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../helpers";

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
