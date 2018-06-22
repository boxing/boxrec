import {BoxrecCommonTablesClass} from "../../boxrec-common-tables/boxrec-common-tables.class";
import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {Location, Record} from "../../boxrec.constants";
import {BoxrecRole} from "../../search/boxrec.search.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageLocationPeopleRow extends BoxrecCommonTablesClass {

    role: BoxrecRole;

    private _idName: string;
    private _miles: string;
    private _location: string;
    private _sex: string;
    private _record: string;
    private _division: string;
    private _career: string;

    constructor(boxrecBodyBout: string, role: BoxrecRole = BoxrecRole.boxer) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        $ = cheerio.load(html);
        this.role = role;

        this.parse();
    }

    get id(): number {
        return <number>BoxrecCommonTablesClass.parseId(this._idName);
    }

    get name(): string {
        return <string>BoxrecCommonTablesClass.parseName(this._idName);
    }

    get miles(): number {
        return parseInt(this._miles, 10);
    }

    /**
     * Some of the results may come back with just the `country`
     * ex. if you search USA, you'll get people "0 miles" from USA, and the region/town is excluded
     * @returns {Location}
     */
    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location);
    }

    get sex(): "male" | "female" {
        return trimRemoveLineBreaks(this._sex) as "male" | "female";
    }

    get record(): Record {
        return BoxrecCommonTablesClass.parseRecord(this._record);
    }

    get division(): WeightDivision | undefined {
        const division: string = trimRemoveLineBreaks(this._division);

        if (Object.values(WeightDivision).includes(division)) {
            return division as WeightDivision;
        }

        console.error("Could not find weight division");
    }

    get career(): (number | null)[] {
        return BoxrecCommonTablesClass.parseCareer(this._career);
    }

    parse(): void {
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
