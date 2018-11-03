import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {convertFractionsToNumber} from "../../helpers";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");

/**
 * BoxRec Boxer Profile Page
 * <pre>ex. http://boxrec.com/en/boxer/155774</pre>
 */
export class BoxrecPageProfileBoxer extends BoxrecPageProfile {

    protected readonly $: CheerioStatic;

    /**
     * @hidden
     */
    protected parseBouts(): void {
        const tr: Cheerio = this.$(".dataTable tbody tr");
        super.parseBouts(tr);
    }

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
    protected _rating: string;
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
        this.$ = cheerio.load(boxrecBodyString);
        super.parseProfileTableData();
        this.parseBouts();
    }

    /**
     * The number of bouts that this boxer has finished by way of KO/TKOing their opponent
     * @returns {number | null}
     */
    get KOs(): number | null {
        const ko: string | void = this.parseProfileTableData(BoxrecProfileTable.KOs);

        if (ko) {
            const kos: number = parseInt(ko, 10);

            if (!isNaN(kos)) {
                return kos;
            }
        }

        return null;
    }

    /**
     * The alias or nickname of the boxer
     * @returns {string | null}
     */
    get alias(): string | null {
        const alias: string | void = this.parseProfileTableData(BoxrecProfileTable.alias);

        if (alias) {
            return BoxrecCommonTablesColumnsClass.parseAlias(alias);
        }

        return null;
    }

    /**
     * Returns the country of which the boxer was born
     * @returns {string | null}
     */
    get birthPlace(): string | null {
        const birthPlace: string = this.$(this.parseProfileTableData(BoxrecProfileTable.birthPlace)).text();

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
        const born: string | void = this.parseProfileTableData(BoxrecProfileTable.born);
        if (born) {
            // some boxers have dob and age.  Match the YYYY-MM-DD
            const regex: RegExp = /(\d{4}\-\d{2}\-\d{2})/;
            const bornMatch: RegExpMatchArray | null = born.match(regex);

            if (bornMatch) {
                return bornMatch[1];
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
        const debut: string | void = this.parseProfileTableData(BoxrecProfileTable.debut);

        if (debut) {
            return debut;
        }

        return null;
    }

    /**
     * Returns the boxer's division
     * This value can be missing
     * @returns {WeightDivision | null}
     */
    get division(): WeightDivision | null {
        const division: string | void = this.parseProfileTableData(BoxrecProfileTable.division);

        if (division) {
            return BoxrecCommonTablesColumnsClass.parseDivision(division);
        }

        return null;
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
        const height: string | void = this.parseProfileTableData(BoxrecProfileTable.height);

        if (height) {
            const regex: RegExp = /^(\d)\&\#x2032\;\s(\d{1,2})(\&\#xB[CDE]\;)?\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const heightMatch: RegExpMatchArray | null = height.match(regex);

            if (heightMatch) {
                const [, imperialFeet, imperialInches, fractionInches, metric] = heightMatch;
                let formattedImperialInches: number = parseInt(imperialInches, 10);
                formattedImperialInches += convertFractionsToNumber(fractionInches);

                return [
                    parseInt(imperialFeet, 10),
                    formattedImperialInches,
                    parseInt(metric, 10),
                ];
            }
        }

        return null;
    }

    /**
     * Returns the nationality of the boxer
     * @returns {string | null}
     */
    get nationality(): string | null {
        const nationality: string | void = this.parseProfileTableData(BoxrecProfileTable.nationality);

        if (nationality) {
            return this.$(nationality).text().trimLeft();
        }

        return null;
    }

    /**
     * Returns the number of bouts this boxer has been in (excluding currently scheduled)
     * @returns {number}
     */
    get numberOfBouts(): number {
        const bouts: string | void = this.parseProfileTableData(BoxrecProfileTable.bouts);

        if (bouts) {
            return parseInt(bouts, 10);
        }

        return 0;
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
        const test: string | void = this.parseProfileTableData(BoxrecProfileTable.ranking);

        if (test) {
            const html: Cheerio = this.$(`<div>${test}</div>`);
            const links: Cheerio = html.find("a");
            const rankings: number[][] = [];

            links.each((i: number, elem: CheerioElement) => {
                const text: string = this.$(elem).text();
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
        const rating: string | void = this.parseProfileTableData(BoxrecProfileTable.rating);
        const html: Cheerio = this.$(rating);

        // todo can this be better?
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
        const reach: string | void = this.parseProfileTableData(BoxrecProfileTable.reach);

        if (reach) {
            const regex: RegExp = /^(\d{2})\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const reachMatch: RegExpMatchArray | null = reach.match(regex);

            if (reachMatch) {
                const [, inches, centimeters]: string[] = reachMatch;
                return [
                    parseInt(inches, 10),
                    parseInt(centimeters, 10),
                ];
            }
        }

        return null;
    }

    /**
     * Returns the current residency of the boxer
     * @returns {string | null}
     */
    // todo can this be converted to return Location?
    get residence(): string | null {
        const residence: string = this.$(this.parseProfileTableData(BoxrecProfileTable.residence)).text();

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
        const role: string =  this.$(this.parseProfileTableData(BoxrecProfileTable.role)).text();; // todo if boxer is promoter as well, should return promoter link

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
        const rounds: string | void = this.parseProfileTableData(BoxrecProfileTable.rounds);

        if (rounds) {
            return parseInt(rounds, 10);
        }

        return null;
    }

    /**
     * Returns the stance of the boxer, either orthodox or southpaw
     * @returns {string | null}
     */
    get stance(): string | null {
        const stance: string | void = this.parseProfileTableData(BoxrecProfileTable.stance);
        if (stance) {
            return stance;
        }

        return null;
    }

    /**
     * Returns whether the boxer is active or inactive
     * @example // returns "active"
     * @returns {string | null}
     */
    get status(): string | null {
        const status: string | void = this.parseProfileTableData(BoxrecProfileTable.status);

        if (status) {
            return status;
        }

        return null;
    }

    /**
     * Returns a string on whether the boxer is suspended or not
     * @returns {string | null}
     */
    get suspended(): string | null {
        const el: Cheerio = this.$("body").find("div:contains('suspended')");
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
        const titlesHeld: string | void = this.parseProfileTableData(BoxrecProfileTable.titlesHeld);

        if (titlesHeld) {
            const html: Cheerio = this.$(titlesHeld);
            const tmpThis: CheerioStatic = this.$;

            return html.find("a").map(function (this: Cheerio): string {
                let text: string = tmpThis(this).text();
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

}
