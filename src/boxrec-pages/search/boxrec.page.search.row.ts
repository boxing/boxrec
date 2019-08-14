import {BoxrecFighterRole} from "boxrec-requests/dist/boxrec-requests.constants";
import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
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
        const alias: string = getColumnData(this.$, 1, true);
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$(alias).find("span").text());
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnDataByColumnHeader(this.$, this.headerColumns,
            "career", false));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnDataByColumnHeader(this.$, this.headerColumns,
            "division", false));
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 1)) as number;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 4));
    }

    get name(): string | null {
        const nameIdEl: Cheerio = this.$(getColumnData(this.$, 1));
        return BoxrecCommonTablesColumnsClass.parseName(nameIdEl.find("a").text());
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
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 3));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 7));
    }

    // todo this should be an array?
    get sport(): BoxrecFighterRole {
        // todo should this be the URL role or the text role?  Do we need a `parseSport` method?
        return trimRemoveLineBreaks(getColumnData(this.$, 2, false)) as BoxrecFighterRole;
    }

}
