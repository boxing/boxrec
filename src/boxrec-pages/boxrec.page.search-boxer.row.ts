import {BoxrecSearch, Location, Record, WinLossDraw} from "./boxrec.constants";
import {trimRemoveLineBreaks} from "../helpers";
import {BoxrecCommonTablesClass} from "./boxrec-common-tables/boxrec-common-tables.class";

const cheerio = require("cheerio");
let $: CheerioAPI;

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

    get get(): BoxrecSearch {
        return {
            id: this.id,
            name: this.name,
            alias: this.alias,
            record: this.record,
            last6: this.last6,
            division: this.division,
            career: this.career,
            residence: this.residence,
        };
    }

    get id(): number {
        if (this._idName) {
            const html = $(`<div>${this._idName}</div>`);
            const href: string = html.find("a").attr("href");
            if (href) {
                const matches = href.match(/(\d+)$/);

                if (matches && matches[1]) {
                    return parseInt(matches[1], 10);
                }
            }
        }

        return -1;
    }

    get name(): string | null {
        if (this._idName) {
            const html = $(`<div>${this._idName}</div>`);
            let name: string = html.text();
            name = trimRemoveLineBreaks(name);

            if (name.slice(-1) === "*") {
                name = name.slice(0, -1);
            }

            return name;
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
        const career: string = this._career;
        const careerMatches = career.match(/(\d{4})-(\d{4})/);
        if (careerMatches && careerMatches.length === 3) {
            return [parseInt(careerMatches[1], 10), parseInt(careerMatches[2], 10)];
        }
        return [null, null];
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

    private parse() {
        // todo either make this a function or table parsing classes should implement an abstract class
        const getColumnData = (nthChild: number, returnHTML: boolean = true): string => {
            const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

            if (returnHTML) {
                return el.html() || "";
            }

            return el.text();
        };

        this._idName = getColumnData(1);
        this._alias = getColumnData(2, false);
        this._record = getColumnData(3);
        this._last6 = getColumnData(4);
        this._division = getColumnData(5, false);
        this._career = getColumnData(6, false);
        this._location = getColumnData(7);
    }
}
