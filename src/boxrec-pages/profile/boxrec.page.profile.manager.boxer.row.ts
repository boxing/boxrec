import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {Location, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

// used for boxer rows under a manager
export class BoxrecPageProfileManagerBoxerRow {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        const html: string = `<table><tr>${boxrecBodyString}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get age(): number | null {
        const age: string = getColumnData(this.$, 6, false);
        if (age) {
            return parseInt(age, 10);
        }

        return null;
    }

    get debut(): string | null {
        const debut: string = getColumnData(this.$, 7, false);
        if (debut) {
            return debut;
        }

        return null;
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 2, false));
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 4));
    }

    get name(): string | null {
        return getColumnData(this.$, 1, false) || null;
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 3));
    }

    get residence(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 7));
    }

    get stance(): Stance | null {
        const stance: string = getColumnData(this.$, 5, false);
        if (stance) {
            return trimRemoveLineBreaks(stance) as Stance;
        }

        return null;
    }

}
