import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {Location, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileManagerBoxerRow {

    constructor(boxrecBodyString: string) {
        const html: string = `<table><tr>${boxrecBodyString}</tr></table>`;
        $ = cheerio.load(html);
    }

    get age(): number | null {
        const age: string = getColumnData($, 6, false);
        if (age) {
            return parseInt(age, 10);
        }

        return null;
    }

    get debut(): string | null {
        const debut: string = getColumnData($, 7, false);
        if (debut) {
            return debut;
        }

        return null;
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData($, 2, false));
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData($, 4));
    }

    get name(): string | null {
        return getColumnData($, 1, false) || null;
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData($, 3));
    }

    get residence(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData($, 7));
    }

    get stance(): Stance | null {
        const stance: string = getColumnData($, 5, false);
        if (stance) {
            return trimRemoveLineBreaks(stance) as Stance;
        }

        return null;
    }

}
