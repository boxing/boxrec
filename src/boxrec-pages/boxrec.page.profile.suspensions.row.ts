import {BoxrecSuspension, BoxrecId} from "./boxrec.constants";
import {trimRemoveLineBreaks} from "../helpers";

const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageProfileSuspensionsRow {

    private _issuedBy: string;
    private _type: string;
    private _startDate: string;
    private _endDate: string;
    private _lengthInDays: string;
    private _eventId: string;

    constructor(boxrecSuspensionRow: string) {
        const html: string = `<table><tr>${boxrecSuspensionRow}</tr></table>`;
        $ = cheerio.load(html);
        this.parse();
    }

    get get(): BoxrecSuspension {
        return {
            issuedBy: this.issuedBy,
            type: this.type,
            startDate: this.startDate,
            endDate: this.endDate,
            lengthInDays: this.lengthInDays,
            eventId: this.eventId,
        };
    }

    get issuedBy(): BoxrecId | null {
        const link = $(this._issuedBy);
        if (link) {

            const href: string = link.attr("href");

            if (href) {
                const hrefMatches: RegExpMatchArray | null = href.match(/\/(\w+)$/);

                if (hrefMatches && hrefMatches[1]) {
                    return {
                        id: hrefMatches[1],
                        name: trimRemoveLineBreaks(link.text()),
                    };
                }
            }
        }

        return null;
    }

    get type(): string {
        return this._type;
    }

    get startDate(): string {
        return trimRemoveLineBreaks(this._startDate);
    }

    get endDate(): string {
        return trimRemoveLineBreaks(this._endDate);
    }

    get lengthInDays(): number {
        const lengthInDays: number = parseInt(this._lengthInDays);

        if (!isNaN(lengthInDays)) {
            return lengthInDays;
        }

        return -1;
    }

    get eventId(): number | null {
        const html = $(this._eventId);

        if (html) {
            const link = html.find("a");
            const href: string = link.attr("href");

            const hrefMatches: RegExpMatchArray | null = href.match(/(\d+)$/);

            if (hrefMatches && hrefMatches[1]) {
                return parseInt(hrefMatches[1], 10);
            }
        }

        return null;
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

        this._issuedBy = getColumnData(1);
        this._type = getColumnData(2, false);
        this._startDate = getColumnData(3, false);
        this._endDate = getColumnData(4, false);
        this._lengthInDays = getColumnData(5, false);
        this._eventId = getColumnData(6);
    }

}

