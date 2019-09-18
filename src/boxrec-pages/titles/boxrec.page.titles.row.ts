import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageTitlesRowOutput} from "./boxrec.page.title.constants";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";

export class BoxrecPageTitlesRow {

    protected readonly $: CheerioStatic;

    constructor(tableRowInnerHTML: string, metadataFollowingRowInnerHTML: string | null = null) {
        this.$ = cheerio.load(`<table><tr>${tableRowInnerHTML}</tr><tr>${metadataFollowingRowInnerHTML}</tr></table>`);
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

    get links(): BoxrecGeneralLinks {
        return BoxrecCommonLinks.parseLinkInformation<BoxrecGeneralLinks>(this.parseLinks(), {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

    get location(): BoxrecLocation {
        // should be 6 or 5?
        const column: number = this.isDivisionPage ? 8 : 5;
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, column), 1);
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): number[] {
        const column: number = this.isDivisionPage ? 10 : 6;
        const numberOfRounds: string = trimRemoveLineBreaks(getColumnData(this.$, column, false));
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

    get output(): BoxrecPageTitlesRowOutput {
        return {
            date: this.date,
            division: this.division,
            firstBoxer: this.firstBoxer,
            firstBoxerWeight: this.firstBoxerWeight,
            links: this.links,
            location: this.location,
            metadata: this.metadata,
            numberOfRounds: this.numberOfRounds,
            outcome: this.outcome,
            rating: this.rating,
            secondBoxer: this.secondBoxer,
            secondBoxerWeight: this.secondBoxerWeight,
        };
    }

    get rating(): number | null {
        const column: number = this.isDivisionPage ? 12 : 8;
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, column));
    }

    get secondBoxer(): BoxrecBasic {
        const column: number = this.isDivisionPage ? 6 : 4;
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, column));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 7, false));
    }

    /**
     * returns if it's a page where division was selected
     * @returns {number}
     */
    private get isDivisionPage(): boolean {
        const len: number = this.getNumberOfColumns();

        if (len === 13) {
            return true;
        } else if (len === 9) {
            return false;
        }

        throw new Error(`Number of columns has changed, received: ${len}`);
    }

    protected parseLinks(): Cheerio {
        return this.$(getColumnData(this.$, this.getNumberOfColumns()));
    }

    private getNumberOfColumns(): number {
        // division page has 13 columns
        // "all scheduled" page has 8 columns
        return this.$("tr:nth-child(1) td").length;
    }

}
