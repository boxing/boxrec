import {convertFractionsToNumber} from "../../helpers";
import {BoxrecPageProfileBout} from "./boxrec.page.profile.bout.row";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * BoxRec Profile Page
 * <pre>ex. http://boxrec.com/en/boxer/155774</pre>
 */
export class BoxrecPageProfile {

    private _name: string | null;

    // profileTable
    private _globalId: string;
    private _role: string;
    private _rating: string;
    private _ranking: string;
    private _vadacbp: string;
    private _bouts: string;
    private _rounds: string;
    private _KOs: string;
    private _status: string;
    private _titlesHeld: string;
    private _birthName: string;
    private _alias: string;
    private _born: string;
    private _nationality: string;
    private _debut: string;
    private _division: string;
    private _height: string;
    private _reach: string;
    private _residence: string;
    private _birthPlace: string;
    private _stance: string;

    // metadata object from the page
    private _metadata: string;

    // other stuff we found that we haven't seen yet
    private _otherInfo: [string, string][] = [];

    private _boutsList: [string, string | null][] = [];

    /**
     * When instantiated the HTML for this page needs to be supplied
     * @param {string} boxrecBodyString     the HTML of the profile page
     */
    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseName();
        this.parseProfileTableData();
        this.parseBouts();
    }

    /**
     * Returns the full name of the boxer
     * @returns {string | null}
     */
    get name(): string | null {
        return this._name || null;
    }

    /**
     * Returns an object of various metadata
     * @returns {Object}
     */
    get metadata(): Object {
        return JSON.parse(this._metadata);
    }

    set name(name: string | null) {
        this._name = name;
    }

    /**
     * Returns the profile global id or id
     * @returns {number | null}
     */
    get globalId(): number | null {
        const globalId: number = parseInt(this._globalId, 10);

        if (!isNaN(globalId)) {
            return globalId;
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
     * Returns the number of bouts this boxer has been in (excluding currently scheduled)
     * @returns {number}
     */
    get numberOfBouts(): number {
        const bouts: number = parseInt(this._bouts, 10);
        return !isNaN(bouts) ? bouts : 0;
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
     * Returns an array of belts that this boxer is currently holding
     * @returns {string[] | null}
     */
    get titlesHeld(): string[] | null {
        if (this._titlesHeld) {
            const html: Cheerio = $(this._titlesHeld);

            return html.find("a").map(function (this: Cheerio): string {
                let text: string = $(this).text();
                // on the Gennady Golovkin profile I found one belt had two spaces in the middle of it
                text = text.replace(/\s{2,}/g, " ");
                return text.trim();
            }).get();
        }

        return null;
    }

    /**
     * The birth name of the boxer
     * @returns {string | null}
     */
    get birthName(): string | null {
        if (this._birthName) {
            return this._birthName;
        }

        return null;
    }

    /**
     * The alias or nickname of the boxer
     * @returns {string | null}
     */
    get alias(): string | null {
        if (this._alias) {
            return this._alias;
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
     * Returns the current weight division of this boxer
     * @returns {string | null}
     */
    get division(): string | null {
        if (this._division) {
            return this._division;
        }

        return null;
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
     * Additional info that was found on the profile but is unknown what to call it
     * @returns {string[][]}
     */
    get otherInfo(): string[][] {
        return this._otherInfo;
    }

    /**
     * Returns an array of bout information
     * The boxer's first bout is at the start of the array
     * The boxer's last or latest bout is at the end of the array
     * @returns {BoxrecPageProfileBout[]}
     */
    get bouts(): BoxrecPageProfileBout[] {
        const bouts: [string, string | null][] = this._boutsList;
        let boutsList: BoxrecPageProfileBout[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecPageProfileBout = new BoxrecPageProfileBout(val[0], val[1]);
            boutsList.push(bout);
        });
        // we want the latest bout at the end of the array and not the start
        // the first key of the array won't be changing every bout
        boutsList.reverse();
        return boutsList;
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

    private parseName(): void {
        this.name = $("h1").text();
    }

    /**
     * Parses the profile table data found at the top of the profile
     */
    private parseProfileTableData(): void {
        const tr: Cheerio = $(".profileTable table.rowTable tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            let key: string | null = $(elem).find("td:nth-child(1)").text();
            let val: string | null = $(elem).find("td:nth-child(2)").html();

            // ranking doesn't have the key, therefore we can only check that `val` exists
            if (val) {
                key = key.trim();
                val = val.trim();
                const enumVals: any[] = Object.keys(BoxrecProfileTable);
                const enumKeys: any[] = enumVals.map(k => BoxrecProfileTable[k]);

                if (enumKeys.includes(key)) {
                    const idx: number = enumKeys.findIndex(item => item === key);
                    const classKey: string = `_${enumVals[idx]}`;
                    // the following line works but there is probably a probably a much better way with Typescript
                    (this as any)[classKey] = val; // set the private var related to this, note: this doesn't consider if there is a setter
                } else {

                    if (val.includes("/en/ratings")) { // ranking doesn't have the `key`
                        this._ranking = val;
                    } else {
                        // either an error or returned something we haven't mapped
                        this._otherInfo.push([key, val]);
                    }
                }
            }
        });

        const metadata: string | null = $("script[type='application/ld+json']").html();
        if (metadata) {
            this._metadata = metadata;
        }
    }

    /**
     * Parses the bout information for the boxer
     */
    private parseBouts(): void {
        const tr: Cheerio = $("#listBoutsResults\\, tbody tr");

        tr.each((i: number, elem: CheerioElement) => {

            const boutId: string = $(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (boutId.includes("second")) {
                return;
            }

            // we need to check to see if the next row is associated with this bout
            let isNextRowAssociated: boolean = false;
            let nextRow: Cheerio | null = $(elem).next();
            let nextRowId: string = nextRow.attr("id");

            if (nextRowId) {
                nextRowId = nextRowId.replace(/[a-zA-Z]/g, "");

                isNextRowAssociated = nextRowId === boutId;
                if (!isNextRowAssociated) {
                    nextRow = null;
                }
            } // else if no next bout exists

            const html: string = $(elem).html() || "";
            const next: string | null = nextRow ? nextRow.html() : null;
            this._boutsList.push([html, next]);
        });
    }

}

// module.exports = BoxrecPageProfile;
