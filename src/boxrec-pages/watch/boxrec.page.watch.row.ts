import {BoxrecCommonTablesColumnsClass} from "@boxrec-common-tables/boxrec-common-tables-columns.class";
import {Record, WinLossDraw} from "@boxrec-constants";
import {trimRemoveLineBreaks} from "@helpers";
import * as cheerio from "cheerio";
import {WeightDivision} from "../champions/boxrec.champions.constants";

export class BoxrecPageWatchRow {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(`<table><tr>${boxrecBodyString}</tr></table>`);
    }

    get alias(): string | null {
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$("td:nth-child(2)").text());
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(this.$("td:nth-child(3)").text());
    }

    get globalId(): number {
        return BoxrecCommonTablesColumnsClass.parseId(this.$("td:nth-child(1)").html() || "") as number;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(this.$("td:nth-child(5)").html() || "");
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(this.$("td:nth-child(1)").text());
    }

    // for some reason the record column appears in the UI but is not populated
    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(this.$("td:nth-child(4)").html() || "");
    }

    get schedule(): string | null {
        return trimRemoveLineBreaks(this.$("table tr:nth-child(6)").text()) || null;
    }

}