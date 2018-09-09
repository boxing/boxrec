import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecTitles} from "../boxrec-common-tables/boxrec-common.constants";
import {BoxrecBasic, BoxrecJudge, Record, WinLossDraw} from "../boxrec.constants";
import {BoxingBoutOutcome} from "../event/boxrec.event.constants";
import {BoxrecProfileBoutLinks, BoxrecProfileBoutLocation} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageProfileBoxerBoutRow /*extends BoxrecCommonTablesClass*/ {

    private $: CheerioStatic;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        /*super();*/
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    // todo remove
    get _metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 2, false));
    }

    /**
     * Returns the boxer's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get firstBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 4));
        }

        return [];
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 3, false));
    }

    // todo this is similar to other code
    get hasBoxerRatings(): boolean {
        return this.hasMoreColumns;
    }

    get judges(): BoxrecJudge[] {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseJudges(metadata);
        }

        return [];
    }

    // returns an object with keys that contain a class other than `clickableIcon`
    get links(): BoxrecProfileBoutLinks { // object of strings
        const linksStr: string = getColumnData(this.$, 16, true);
        const html: Cheerio = this.$(linksStr);
        const obj: BoxrecProfileBoutLinks = {
            bout: null,
            bio_open: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = this.$(elem).find("div");
            const href: string = this.$(elem).attr("href");
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
        const locationStr: string = getColumnData(this.$, 11, false);
        const [venue, town] = locationStr.split(",").map(item => item.trim());
        location.town = town;
        location.venue = venue;

        return location;
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnData(this.$, 14));
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 12, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 14));
    }

    get referee(): BoxrecBasic | null {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseReferee(metadata);
        }

        return null;
    }

    get result(): [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null] {
        const result: string = getColumnData(this.$, 13);
        return [this.outcome, this.outcomeByWayOf(result), this.outcomeByWayOf(result, true)];
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 6));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 10));
    }

    /**
     * Returns the opponents's rating in number of points
     * First number is the boxer's points before the fight
     * Second number is the boxer's points after the fight
     * Higher number is better
     * @returns {(number | null)[]}
     */
    get secondBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 8));
        }

        return [];
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 9));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 7, false));
    }

    get titles(): BoxrecTitles[] {
        const metadata: string | null = this.metadata;

        if (metadata) {
            return BoxrecCommonTablesColumnsClass.parseTitles(metadata);
        }

        return [];
    }

    private get hasMoreColumns(): boolean {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        return this.$(`tr:nth-child(1) td`).length === 16;
    }

    /**
     * Parses Before/After ratings of a boxer
     * @param {string} rating
     * @returns {Array<number | null>}
     */
    static parseBoxerRating(rating: string): Array<number | null> {
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

    private outcomeByWayOf(htmlString: string, parseText: boolean = false): BoxingBoutOutcome | string | null {
        return BoxrecCommonTablesColumnsClass.parseOutcomeByWayOf(htmlString, parseText);
    }

}
