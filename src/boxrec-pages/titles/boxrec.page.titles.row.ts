import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, Location, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecTitleLinks} from "../title/boxrec.title.common";
import {BoxrecTitlesCommon} from "./boxrec.titles.common";

export class BoxrecPageTitlesRow extends BoxrecTitlesCommon {

    protected readonly $: CheerioStatic;

    constructor(tableRowInnerHTML: string, metadataFollowingRowInnerHTML: string | null = null) {
        const html: string = `<table><tr>${tableRowInnerHTML}</tr><tr>${metadataFollowingRowInnerHTML}</tr></table>`;
        super(html);
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 1, false));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 2));
    }

    get firstBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 3));
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 4, false));
    }

    get links(): BoxrecTitleLinks {
        const html: Cheerio = this.$(getColumnData(this.$, 12));
        // return super.links(html);
    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 8), 1);
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
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 5, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 11));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 6));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 7, false));
    }

}
