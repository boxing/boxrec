import {BoxrecFighterRole} from "boxrec-requests/dist/boxrec-requests.constants";
import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageSearchRowOutput} from "./boxrec.search.constants";

// includes BoxRec role regardless of searching for all fighters or a specific fight role
export class BoxrecPageSearchRow {

    private readonly $: CheerioStatic;

    constructor(private headerColumns: string[], boxrecBodySearchRow: string) {
        const html: string = `<table><tr>${boxrecBodySearchRow}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get alias(): string | null {
        const alias: string = `<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name)}</div>`;
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$(alias).find("span").text());
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.career, false));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.division, false));
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name)) as number;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstLast6));
    }

    get name(): string | null {
        const nameIdEl: string = `<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name)}</div>`;
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$(nameIdEl).find("a").text());
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
            sport: this.sport, // todo is not part roles other than fighters
        };
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.record));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.residence));
    }

    // todo this should be an array?
    get sport(): BoxrecFighterRole {
        // todo should this be the URL role or the text role?  Do we need a `parseSport` method?
        return trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.sport)) as BoxrecFighterRole;
    }

}
