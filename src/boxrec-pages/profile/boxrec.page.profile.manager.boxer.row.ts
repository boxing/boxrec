import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {Location, Record, Stance} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileManagerBoxerRow extends BoxrecCommonTablesClass {

    private _age: string;
    private _debut: string;
    private _last6: string;
    private _name: string;
    private _record: string;
    private _residence: string;
    private _stance: string;

    constructor(boxrecBodyString: string) {
        super();
        const html: string = `<table><tr>${boxrecBodyString}</tr></table>`;
        $ = cheerio.load(html);
        this.parseBoxer();
    }

    get age(): number | null {
        if (this._age) {
            return parseInt(this._age, 10);
        }

        return null;
    }

    get debut(): string | null {
        if (this._debut) {
            return this._debut;
        }

        return null;
    }

    get name(): string | null {
        return this._name || null;
    }

    get record(): Record {
        return BoxrecCommonTablesClass.parseRecord(this._record);
    }

    get residence(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._residence);
    }

    get stance(): Stance | null {
        if (this._stance) {
            return trimRemoveLineBreaks(this._stance) as Stance;
        }

        return null;
    }

    private parseBoxer(): void {
        this._name = getColumnData($, 1, false);
        this._division = getColumnData($, 2, false);
        this._record = getColumnData($, 3);
        this._last6 = getColumnData($, 4);
        this._stance = getColumnData($, 5, false);
        this._age = getColumnData($, 6, false);
        this._debut = getColumnData($, 7, false);
        this._residence = getColumnData($, 7);
    }

}
