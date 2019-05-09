import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData} from "../../helpers";
import {BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageSearchRowOutput} from "./boxrec.search.constants";

export class BoxrecPageSearchRow {

    private readonly $: CheerioStatic;

    constructor(boxrecBodySearchRow: string) {
        const html: string = `<table><tr>${boxrecBodySearchRow}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get alias(): string | null {
        return BoxrecCommonTablesColumnsClass.parseAlias(getColumnData(this.$, 2, false));
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnData(this.$, 6, false));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 5, false));
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 1)) as number;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 4));
    }

    get name(): string | null {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnData(this.$, 1));
    }

    get output(): BoxrecPageSearchRowOutput {
        return {
            alias: this.alias,
            career: this.career,
            division: this.division,
            id: this.id,
            last6: this.last6,
            name: this.name,
            record: this.record,
            residence: this.residence,
        };
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 3));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 7));
    }

}
