import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecBasic, Location, WinLossDraw} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageTitleRow {

    private $: CheerioStatic;

    constructor(tableRowInnerHTML: string, metadataFollowingRowInnerHTML: string | null = null) {
        const html: string = `<table><tr>${tableRowInnerHTML}</tr><tr>${metadataFollowingRowInnerHTML}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 1, false));
    }

    get firstBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 2));
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 3, false));
    }

    get links(): string {
        // todo I think this was ever working properly
        return getColumnData(this.$, 11);
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 7), 1);
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): number[] {
        const numberOfRounds: string = trimRemoveLineBreaks(getColumnData(this.$, 9, false));
        if (numberOfRounds.includes("/")) {
            // ended early
            return numberOfRounds.split("/").map(item => parseInt(item, 10));
        }

        const parsedNumberOfRounds: number = parseInt(numberOfRounds, 10);
        // went to decision
        return [parsedNumberOfRounds, parsedNumberOfRounds];
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 4, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 10));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 5));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 6, false));
    }

}
