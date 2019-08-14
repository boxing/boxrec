import {getHeaderColumnText} from "./helpers";

export class BoxrecGetHeadersMixin {

    protected readonly $: CheerioStatic;
    protected headerColumns: string[] = [];

    // is used
    protected parseTableHeaderText(tableEl: string): string[] {
        if (!this.headerColumns || this.headerColumns.length === 0) {
            this.headerColumns = [];
            this.headerColumns = getHeaderColumnText(this.$(tableEl));
        }

        return this.headerColumns;
    }

}
/*

export interface BoxrecPageTableParsing extends BoxrecGetHeadersMixin {
    parseRatingsTableHeaderText: (tableEl: string) => string[];
}

export class BoxrecPageTableParsing {}
*/
