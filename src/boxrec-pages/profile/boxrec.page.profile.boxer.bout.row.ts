import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecRole} from "../search/boxrec.search.constants";
import {BoxrecProfileBoutLinks, BoxrecProfileBoutLocation} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileBoxerBoutRow extends BoxrecCommonTablesClass {

    hasBoxerRatings: boolean = false;
    private _date: string;
    private _firstBoxerRating: string;
    private _links: string;
    private _location: string;
    private _secondBoxerRating: string;
    private _startColumn: number = 1;
    private role: BoxrecRole = BoxrecRole.boxer;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);
        this.parseBout();
        this.parseMetadata();
    }

    get date(): string {
        return trimRemoveLineBreaks(this._date);
    }

    /**
     * Returns the boxer's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get firstBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(this._firstBoxerRating);
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

    /**
     * Returns the opponents's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get secondBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(this._secondBoxerRating);
    }

    private static parseBoxerRating(rating: string): Array<number | null> {
        const ratings: Array<number | null> = [null, null];
        const ratingsMatch: RegExpMatchArray | null = trimRemoveLineBreaks(rating)
            .replace(/,/g, "")
            .match(/^(\d{1,5})&#x279E;(\d{1,5})$/);

        if (ratingsMatch) {
            ratings[0] = parseInt(ratingsMatch[1], 10);
            ratings[1] = parseInt(ratingsMatch[2], 10);
        }

        return ratings;
    }

    private getColumnData(returnHtml: boolean = false): string {
        this._startColumn++;
        return getColumnData($, this._startColumn, returnHtml);
    }

    private parseBout(): void {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        const numberOfColumns: number = $(`tr:nth-child(1) td`).length;

        this.hasBoxerRatings = numberOfColumns === 16;

        // whether the boxer ratings are showing or not, we'll deliver the correct data
        // set the start column, when calling `getColumnData`, bump the number up
        this._startColumn = 1;

        this._date = this.getColumnData();
        this._firstBoxerWeight = this.getColumnData();

        if (this.hasBoxerRatings) {
            this._firstBoxerRating = this.getColumnData(true);
        }

        // empty 4th/5th column, move the number ahead
        this._startColumn++;

        this._secondBoxer = this.getColumnData(true);
        this._secondBoxerWeight = this.getColumnData();

        if (this.hasBoxerRatings) {
            this._secondBoxerRating = this.getColumnData(true);
        }

        this._secondBoxerRecord = this.getColumnData(true);
        this._secondBoxerLast6 = this.getColumnData(true);
        this._location = this.getColumnData();
        this._outcome = this.getColumnData();
        this._outcomeByWayOf = this.getColumnData(true);
        this._numberOfRounds = this.getColumnData();
        this._rating = this.getColumnData(true);
        this._links = this.getColumnData(true);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}
