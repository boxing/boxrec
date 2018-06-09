import {Location, Record, WinLossDraw} from "../boxrec.constants";
import {getColumnData} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageSearchBoxerRow extends BoxrecCommonTablesClass {

    private _idName: string;
    private _alias: string;
    private _record: string;
    private _last6: string;
    private _division: string;
    private _career: string;
    private _location: string;

    constructor(boxrecBodySearchRow: string) {
        super();
        const html: string = `<table><tr>${boxrecBodySearchRow}</tr></table>`;
        $ = cheerio.load(html);

        this.parse();
    }

    get id(): number {
        if (this._idName) {
            return <number>super.parseId(this._idName);
        }

        return -1;
    }

    get name(): string | null {
        if (this._idName) {
            return super.parseName(this._idName);
        }

        return null;
    }

    get alias(): string | null {
        if (this._alias) {
            return this._alias.trim();
        }

        return null;
    }

    get division(): string {
        return this._division.trim();
    }

    get career(): (number | null)[] {
        return super.parseCareer(this._career);
    }

    get record(): Record {
        return super.parseRecord(this._record);
    }

    get last6(): WinLossDraw[] {
        return super.parseLast6Column(this._last6);
    }

    get residence(): Location {
        return super.parseLocationLink(this._location);
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
