import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecCommonTablesClass} from "../../boxrec-common-tables/boxrec-common-tables.class";
import {Location, Record} from "../../boxrec.constants";
import {BoxrecRole} from "../../search/boxrec.search.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageLocationPeopleRow extends BoxrecCommonTablesClass {

    role: BoxrecRole;
    private _career: string;
    private _idName: string;
    private _location: string;
    private _miles: string;
    private _record: string;
    private _sex: string;

    constructor(boxrecBodyBout: string, role: BoxrecRole = BoxrecRole.boxer) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        $ = cheerio.load(html);
        this.role = role;

        this.parse();
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesClass.parseCareer(this._career);
    }

    get id(): number {
        return BoxrecCommonTablesClass.parseId(this._idName) as number;
    }

    /**
     * Some of the results may come back with just the `country`
     * ex. if you search USA, you'll get people "0 miles" from USA, and the region/town is excluded
     * @returns {Location}
     */
    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location);
    }

    get miles(): number {
        return parseInt(this._miles, 10);
    }

    get name(): string {
        return BoxrecCommonTablesClass.parseName(this._idName) as string;
    }

    get record(): Record {
        return BoxrecCommonTablesClass.parseRecord(this._record);
    }

    get sex(): "male" | "female" {
        return trimRemoveLineBreaks(this._sex) as "male" | "female";
    }

    private parse(): void {
        this._miles = getColumnData($, 1, false);
        this._location = getColumnData($, 2);
        this._idName = getColumnData($, 3);
        this._sex = getColumnData($, 4, false);

        // the only `role` with different columns is boxers
        if (this.role === BoxrecRole.boxer) {
            this._record = getColumnData($, 5);
            this._division = getColumnData($, 6, false);
            this._career = getColumnData($, 7);
        }

    }

}
