import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageWatchRowOutput} from "./boxrec.watch.constants";

export class BoxrecPageWatchRow {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(`<table><tr>${boxrecBodyString}</tr></table>`);
    }

    get alias(): string | null {
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$("td:nth-child(2)").text());
    }

    get globalId(): number {
        return BoxrecCommonTablesColumnsClass.parseId(this.$("td:nth-child(1)").html() || "") as number;
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(this.$("td:nth-child(1)").text());
    }

    get output(): BoxrecPageWatchRowOutput {
        return {
            alias: this.alias,
            globalId: this.globalId,
            name: this.name,
            schedule: this.schedule,
        };
    }

    get schedule(): string | null {
        return trimRemoveLineBreaks(this.$("table tr:nth-child(3)").text()) || null;
    }

}
