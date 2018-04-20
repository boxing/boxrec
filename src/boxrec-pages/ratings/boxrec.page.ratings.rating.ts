import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecRating, Location, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";

const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageRatingsRating extends BoxrecCommonTablesClass {

    private _ranking: string;
    private _idName: string;
    private _points: string;
    private _age: string;
    private _record: string;
    private _last6: string;
    private _stance: string;
    private _location: string;
    private _division: string;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);

        this.parse();
    }

    get get(): BoxrecRating {
        return {
            id: this.id,
            name: this.name,
            points: this.points,
            rating: this.rating,
            age: this.age,
            record: this.record,
            last6: this.last6,
            stance: this.stance,
            residence: this.residence,
            division: this.division,
        };
    }

    get ranking(): number | null {
        if (this._ranking) {
            return parseInt(this._ranking, 10);
        }

        return null;
    }

    get id(): number | null {
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

        return null;
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

    get division(): string | null {
        if (this._division) {
            return this._division.trim();
        }

        return null;
    }

    get hasBoutScheduled(): boolean | null {
        if (this._idName) {
            const html = $(`<div>${this._idName}</div>`);
            let name: string = html.text();
            name = name.trim();
            return name.slice(-1) === "*";
        }

        return null;
    }

    get points(): number | null {
        let points: number = parseInt(this._points, 10);

        if (!isNaN(points)) {
            return points;
        }

        return null;
    }

    get age(): number | null {
        if (this._age) {
            return parseInt(this._age, 10);
        }

        return null;
    }

    get record(): Record {
        return super.parseRecord(this._record);
    }

    get last6(): WinLossDraw[] {
        return super.parseLast6Column(this._last6);
    }

    get stance(): Stance | null {
        if (this._stance) {
            return trimRemoveLineBreaks(this._stance) as Stance;
        }

        return null;
    }

    get residence(): Location {
        return super.parseLocationLink(this._location);
    }

    parse() {
        // todo either make this a function or table parsing classes should implement an abstract class
        const getColumnData = (nthChild: number, returnHTML: boolean = true): string => {
            const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

            if (returnHTML) {
                return el.html() || "";
            }

            return el.text();
        };

        // on pages where it's about a specific weight class, the division column is omitted
        const hasDivision: boolean = $(`tr:nth-child(1) td`).length === 9;

        this._ranking = getColumnData(1, false);
        this._idName = getColumnData(2);
        this._points = getColumnData(3, false);
        this._rating = getColumnData(4);

        if (hasDivision) {
            this._division = getColumnData(5, false);
            this._age = getColumnData(6, false);
            this._record = getColumnData(7);
            this._last6 = getColumnData(7);
            this._stance = getColumnData(8, false);
            this._location = getColumnData(9);
        } else {
            this._age = getColumnData(5, false);
            this._record = getColumnData(6);
            this._last6 = getColumnData(6);
            this._stance = getColumnData(7, false);
            this._location = getColumnData(8);
        }

    }

}
