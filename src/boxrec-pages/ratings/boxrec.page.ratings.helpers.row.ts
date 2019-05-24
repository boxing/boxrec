import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";

// helper class for common ratings columns
export abstract class BoxrecPageRatingsHelpersRow {

    static getAge($: CheerioStatic, columnNumber: number): number {
        const age: string = getColumnData($, columnNumber, false);

        return parseInt(age, 10);
    }

    static getCareer($: CheerioStatic, columnNumber: number): number[] {
        const career: string = trimRemoveLineBreaks(getColumnData($, columnNumber, false));

        return career.split("-").map(item => parseInt(item, 10));
    }

    static getRating($: CheerioStatic, columnNumber: number): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData($, columnNumber));
    }

}
