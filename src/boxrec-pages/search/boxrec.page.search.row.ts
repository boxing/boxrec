import {getColumnData} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {Location, Record, WinLossDraw} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageSearchRow extends BoxrecCommonTablesClass {

    private _alias: string;
    private _career: string;
    private _idName: string;
    private _last6: string;
    private _location: string;
    private _record: string;

    constructor(boxrecBodySearchRow: string) {
        super();
        const html: string = `<table><tr>${boxrecBodySearchRow}</tr></table>`;
        $ = cheerio.load(html);

        this.parse();
    }

    get alias(): string | null {
        return BoxrecCommonTablesClass.parseAlias(this._alias);
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesClass.parseCareer(this._career);
    }

    get id(): number {
        if (this._idName) {
            return BoxrecCommonTablesClass.parseId(this._idName) as number;
        }

        return -1;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesClass.parseLast6Column(this._last6);
    }

    get name(): string | null {
        if (this._idName) {
            return BoxrecCommonTablesClass.parseName(this._idName);
        }

        return null;
    }

    get record(): Record {
        return BoxrecCommonTablesClass.parseRecord(this._record);
    }

    get residence(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location);
    }

    private parse(): void {
        this._idName = getColumnData($, 1);
        this._alias = getColumnData($, 2, false);
        this._record = getColumnData($, 3);
        this._last6 = getColumnData($, 4);
        this._division = getColumnData($, 5, false);
        this._career = getColumnData($, 6, false);
        this._location = getColumnData($, 7);
    }
}
