import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecEvent} from "./boxrec.event";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Parse an Event page
 */
export class BoxrecPageEvent extends BoxrecEvent {

    protected _date: string | null = null;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        this.parseDate();
        this.parseEventData();
    }

    get date(): string | null {
        if (this._date) {
            return trimRemoveLineBreaks(this._date);
        }

        return this._date;
    }

    get id(): number {
        return parseInt(this._id, 10);
    }

    private parseDate(): void {
        const eventResults: Cheerio = $("table");
        const date: string = $(eventResults).find("h2").text(); // ex. Saturday 5, May 2018
        // if date hasn't been set, this will be an empty string, leave as null
        if (date) {
            this._date = new Date(date).toISOString().slice(0, 10);
        }
    }

    private parseEventData(): void {
        const eventResults: Cheerio = $("table");

        $(eventResults).find("thead table tbody tr").each((i: number, elem: CheerioElement) => {
            const tag: string = $(elem).find("td:nth-child(1)").text().trim();
            const val: Cheerio = $(elem).find("td:nth-child(2)");

            if (tag === "commission") {
                this._commission = val.text();
            } else if (tag === "promoter") {
                this._promoter = val.html();
            } else if (tag === "matchmaker") {
                this._matchmaker = val.html();
            } else if (tag === "television") {
                this._television = val.text();
            } else if (tag === "doctor") {
                this._doctor = val.html();
            } else if (tag === "inspector") {
                this._inspector = val.html();
            }
        });

        const wikiHref: string | null = $(eventResults).find("h2").next().find(".bio_closedP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                this._id = wikiLink[1];
            }
        }

        this._location = $(eventResults).find("thead table > tbody tr:nth-child(2) b").html();
    }

}
