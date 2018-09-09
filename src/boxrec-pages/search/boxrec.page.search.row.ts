import {getColumnData} from "../../helpers";
import {BoxrecCommonTablesImprovedClass} from "../boxrec-common-tables/boxrec-common-tables-improved.class";
import {Location, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageSearchRow {

    private $: CheerioStatic;

    constructor(boxrecBodySearchRow: string) {
        const html: string = `<table><tr>${boxrecBodySearchRow}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get alias(): string | null {
        return BoxrecCommonTablesImprovedClass.parseAlias(getColumnData(this.$, 2, false));
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesImprovedClass.parseCareer(getColumnData(this.$, 6, false));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesImprovedClass.parseDivision(getColumnData(this.$, 5, false));
    }

    get id(): number {
        return BoxrecCommonTablesImprovedClass.parseId(getColumnData(this.$, 1)) as number;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesImprovedClass.parseLast6Column(getColumnData(this.$, 4));
    }

    get name(): string | null {
        return BoxrecCommonTablesImprovedClass.parseName(getColumnData(this.$, 1));
    }

    get record(): Record {
        return BoxrecCommonTablesImprovedClass.parseRecord(getColumnData(this.$, 3));
    }

    get residence(): Location {
        return BoxrecCommonTablesImprovedClass.parseLocationLink(getColumnData(this.$, 7));
    }

}
