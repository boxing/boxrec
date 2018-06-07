import {getColumnData} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecProfileBoutLinks, BoxrecProfileBoutLocation} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileBout extends BoxrecCommonTablesClass {

    private _date: string;
    private _links: string;
    private _location: string;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);

        this.parseBout();
        this.parseMetadata();
    }

    get date(): string {
        const date: string = this._date;
        return date.trim();
    }

    get location(): BoxrecProfileBoutLocation {
        // instead of returning undefined, I'm sure there will be records where pieces of this information are missing or different
        const location: BoxrecProfileBoutLocation = {
            town: null,
            venue: null,
        };
        const [venue, town] = this._location.split(",").map(item => item.trim());
        location.town = town;
        location.venue = venue;

        return location;
    }

    // returns an object with keys that contain a class other than `clickableIcon`
    get links(): BoxrecProfileBoutLinks { // object of strings
        const html: Cheerio = $(this._links);
        const obj: BoxrecProfileBoutLinks = {
            bout: null,
            bio_open: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = $(elem).find("div");
            const href: string = $(elem).attr("href");
            const classAttr: string = div.attr("class");
            const hrefArr: string[] = classAttr.split(" ");

            hrefArr.forEach(cls => {
                if (cls !== "primaryIcon") {
                    const matches: RegExpMatchArray | null = href.match(/(\d+)$/);
                    if (matches && matches[1] && matches[1] !== "other") {

                        let formattedCls: string = cls;
                        // for some reason they add a `P` to the end of the class name, we will remove it
                        if (cls.slice(-1) === "P") {
                            formattedCls = cls.slice(0, -1);
                        }

                        (obj as any)[formattedCls] = parseInt(matches[1], 10);
                    } else {
                        (obj as any).other.push(href);
                    }
                }
            });
        });

        return obj;
    }

    private parseBout(): void {
        this._date = getColumnData($, 2, false);
        this._firstBoxerWeight = getColumnData($, 3, false);
        // empty 4th column
        this._secondBoxer = getColumnData($, 5);
        this._secondBoxerWeight = getColumnData($, 6, false);
        this._secondBoxerRecord = getColumnData($, 7);
        this._secondBoxerLast6 = getColumnData($, 8);
        this._location = getColumnData($, 9, false);
        this._outcome = getColumnData($, 10, false);
        this._outcomeByWayOf = getColumnData($, 11);
        this._numberOfRounds = getColumnData($, 12, false);
        this._rating = getColumnData($, 13);
        this._links = getColumnData($, 14);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}
