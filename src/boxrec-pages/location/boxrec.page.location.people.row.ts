import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {Location, Record} from "../boxrec.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageLocationPeopleRow extends BoxrecCommonTablesClass {

    role: BoxrecRole;

    _idName: string;
    _miles: string;
    _location: string;
    _name: string;
    _sex: string;
    _record: string;
    _division: string;
    _career: string;

    constructor(boxrecBodyBout: string, role: BoxrecRole = BoxrecRole.boxer) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        $ = cheerio.load(html);
        this.role = role;

        this.parse();
    }

    get id(): number {
        return <number>super.parseId(this._idName);
    }

    get name(): string {
        return <string>super.parseName(this._idName);
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
        return super.parseLocationLink(this._location);
    }

    get sex(): "male" | "female" {
        // todo `trimRemoveLineBreaks` this might not be needed, I ripped the test spec page by using viewsource, maybe using boxrec-mocks properly will have better results
        return trimRemoveLineBreaks(this._sex) as "male" | "female";
    }

    get record(): Record {
        return super.parseRecord(this._record);
    }

    // todo, can we convert all these to WeightClass?
    get division(): string {
        return this._division;
    }

    get career(): (number | null)[] {
        return super.parseCareer(this._career);
    }

    parse(): void {

        this._miles = getColumnData($, 1, false);
        // second column is link to map
        this._location = getColumnData($, 3);
        this._idName = getColumnData($, 4);
        this._sex = getColumnData($, 5, false);

        // the only `role` with different columns is boxers
        if (this.role === BoxrecRole.boxer) {
            this._record = getColumnData($, 6);
            this._division = getColumnData($, 7, false);
            this._career = getColumnData($, 8);
        }

    }

}

