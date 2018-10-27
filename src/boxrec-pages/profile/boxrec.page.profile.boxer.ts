import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {convertFractionsToNumber} from "../../helpers";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * BoxRec Boxer Profile Page
 * <pre>ex. http://boxrec.com/en/boxer/155774</pre>
 */
export class BoxrecPageProfileBoxer extends BoxrecPageProfile {

    /**
     * @hidden
     */
    protected _KOs: string;
    /**
     * @hidden
     */
    protected _bouts: string;
    /**
     * @hidden
     */
    protected _division: string;
    /**
     * @hidden
     */
    protected _height: string;
    /**
     * @hidden
     */
    protected _rating: string;
    /**
     * @hidden
     */
    protected _reach: string;
    /**
     * @hidden
     */
    protected _rounds: string;
    /**
     * @hidden
     */
    protected _stance: string;
    /**
     * @hidden
     */
    protected _titlesHeld: string;
    /**
     * @hidden
     */
    protected _vadacbp: string;

    /**
     * When instantiated the HTML for this page needs to be supplied
     * @param {string} boxrecBodyString     the HTML of the profile page
     * @param {string} boxrecBodyString     the HTML of the profile page
     */
    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        super.parseProfileTableData();
        this.parseBouts();
    }

    /**
     * The number of bouts that this boxer has finished by way of KO/TKOing their opponent
     * @returns {number | null}
     */
    get KOs(): number | null {
        const kos: number = parseInt(this._KOs, 10);

        if (!isNaN(kos)) {
            return kos;
        }

        return null;
    }

    /**
     * The alias or nickname of the boxer
     * @returns {string | null}
     */
    get alias(): string | null {
        return BoxrecCommonTablesColumnsClass.parseAlias(this._alias);
    }

    /**
     * Returns the country of which the boxer was born
     * @returns {string | null}
     */
    get birthPlace(): string | null {
        const birthPlace: string = $(this._birthPlace).text();

        if (birthPlace) {
            return birthPlace;
        }

        return null;
    }

    /**
     * Returns the date of birth of the boxer
     * @example // Gennady Golovkin would return "1982-04-08"
     * @returns {string | null}
     */
    get born(): string | null {
        if (this._born) {
            // some boxers have dob and age.  Match the YYYY-MM-DD
            const regex: RegExp = /(\d{4}\-\d{2}\-\d{2})/;
            const born: RegExpMatchArray | null = this._born.match(regex);

            if (born) {
                return born[1];
            }
        }

        return null;
    }

    /**
     * Returns an array of bout information
     * The boxer's first bout is at the start of the array
     * The boxer's last or latest bout is at the end of the array
     * For all other roles, it is most recent first
     * @returns {BoxrecPageProfileBoxerBoutRow[]}
     */
    get bouts(): BoxrecPageProfileBoxerBoutRow[] {
        const boutsList: BoxrecPageProfileBoxerBoutRow[] = super.getBouts(BoxrecPageProfileBoxerBoutRow);
        boutsList.reverse();
        return boutsList;
    }

    /**
     * Returns the date of their professional debut bout
     * @returns {string | null}
     */
    get debut(): string | null {
        if (this._debut) {
            return this._debut;
        }

        return null;
    }

    /**
     * Returns the boxer's division
     * This value can be missing
     * @returns {WeightDivision | null}
     */
    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(this._division);
    }

    /**
     * Returns whether the boxer has a bout scheduled or not
     * @example // Mike Tyson would return false
     * @returns {boolean}
     */
    get hasBoutScheduled(): boolean {
        return this.bouts.length > this.numberOfBouts;
    }

    /**
     * Returns the boxer's height
     * fractional symbols are changed to decimals.  ¼ = 0.25, ½ = 0.5, ¾ = 0.75
     * @returns {number[] | null}
     */
    get height(): number[] | null {
        let height: number[] | null = null;
        if (this._height) {
            const regex: RegExp = /^(\d)\&\#x2032\;\s(\d{1,2})(\&\#xB[CDE]\;)?\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const heightMatch: RegExpMatchArray | null = this._height.match(regex);

            if (heightMatch) {
                const [, imperialFeet, imperialInches, fractionInches, metric] = heightMatch;
                let formattedImperialInches: number = parseInt(imperialInches, 10);
                formattedImperialInches += convertFractionsToNumber(fractionInches);

                height = [
                    parseInt(imperialFeet, 10),
                    formattedImperialInches,
                    parseInt(metric, 10),
                ];
            }
        }

        return height;
    }

    /**
     * Returns the nationality of the boxer
     * @returns {string | null}
     */
    get nationality(): string | null {
        if (this._nationality) {
            return $(this._nationality).text().trimLeft();
        }

        return null;
    }

    /**
     * Returns the number of bouts this boxer has been in (excluding currently scheduled)
     * @returns {number}
     */
    get numberOfBouts(): number {
        const bouts: number = parseInt(this._bouts, 10);
        return !isNaN(bouts) ? bouts : 0;
    }

    /**
     * Additional info that was found on the profile but is unknown what to call it
     * @returns {string[][]}
     */
    get otherInfo(): string[][] {
        return this._otherInfo;
    }

    /**
     * Returns an array of where they stand in their division and in their country (by class)
     * @returns {number[][] | null}
     */
    get ranking(): number[][] | null {
        if (this._ranking) {
            const html: Cheerio = $(`<div>${this._ranking}</div>`);
            const links: Cheerio = html.find("a");
            const rankings: number[][] = [];

            links.each((i: number, elem: CheerioElement) => {
                const text: string = $(elem).text();
                const parsedArr: number[] = text.trim().replace(",", "").split("/").map((str: string) => parseInt(str, 10));
                rankings.push(parsedArr);
            });

            return rankings;
        }

        return null;
    }

    /**
     * Returns the boxer's overall BoxRec rating
     * @returns {number | null}
     */
    get rating(): number | null {
        const html: Cheerio = $(this._rating);

        if (html.get(0)) {
            const widthString: string = html.get(0).attribs.style;
            // this uses pixels, where the others use percentage
            const regex: RegExp = /width\:(\d+)px\;/;
            const matches: RegExpMatchArray | null = widthString.match(regex);

            if (matches && matches[1]) {
                return parseInt(matches[1], 10);
            }
        }

        return null;
    }

    /**
     * Returns the arm reach of the boxer
     * @returns {number[] | null}
     */
    get reach(): number[] | null {
        let reach: number[] | null = null;
        if (this._reach) {
            const regex: RegExp = /^(\d{2})\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const reachMatch: RegExpMatchArray | null = this._reach.match(regex);

            if (reachMatch) {
                const [, inches, centimeters]: string[] = reachMatch;
                reach = [
                    parseInt(inches, 10),
                    parseInt(centimeters, 10),
                ];
            }
        }

        return reach;
    }

    /**
     * Returns the current residency of the boxer
     * @returns {string | null}
     */
    // todo can this be converted to return Location?
    get residence(): string | null {
        const residence: string = $(this._residence).text();

        if (residence) {
            return residence;
        }

        return null;
    }

    /**
     * Returns the entire string of roles this person has
     * @returns {string | null}
     */
    get role(): string | null {
        const role: string = $(this._role).text(); // todo if boxer is promoter as well, should return promoter link
        if (role) {
            return role;
        }

        return null;
    }

    /**
     * Returns the number of rounds this boxer has been in in their professional career
     * @returns {number | null}
     */
    get rounds(): number | null {
        const rounds: number = parseInt(this._rounds, 10);

        if (!isNaN(rounds)) {
            return rounds;
        }

        return null;
    }

    /**
     * Returns the stance of the boxer, either orthodox or southpaw
     * @returns {string | null}
     */
    get stance(): string | null {
        if (this._stance) {
            return this._stance;
        }

        return null;
    }

    /**
     * Returns whether the boxer is active or inactive
     * @example // returns "active"
     * @returns {string | null}
     */
    get status(): string | null {
        if (this._status) {
            return this._status;
        }

        return null;
    }

    /**
     * Returns a string on whether the boxer is suspended or not
     * @returns {string | null}
     */
    get suspended(): string | null {
        const el: Cheerio = $("body").find("div:contains('suspended')");
        if (el.length) {
            return el.text();
        }

        return null;
    }

    /**
     * Returns an array of belts that this boxer is currently holding
     * @returns {string[]}
     */
    get titlesHeld(): string[] {
        if (this._titlesHeld) {
            const html: Cheerio = $(this._titlesHeld);

            return html.find("a").map(function (this: Cheerio): string {
                let text: string = $(this).text();
                // on the Gennady Golovkin profile I found one belt had two spaces in the middle of it
                text = text.replace(/\s{2,}/g, " ");
                return text.trim();
            }).get();
        }

        return [];
    }

    /**
     * Returns if they are enrolled into VADA (Voluntary Anti-Doping Association)
     * @example // may return "enrolled"
     * @returns {string | null}
     */
    get vadacbp(): string | null {
        if (this._vadacbp) {
            return this._vadacbp;
        }

        return null;
    }

    /**
     * @hidden
     */
    protected parseBouts(): void {
        const tr: Cheerio = $(".dataTable tbody tr");
        super.parseBouts(tr);
    }

}
