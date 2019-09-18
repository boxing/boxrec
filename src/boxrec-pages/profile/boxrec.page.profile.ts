import {BoxrecRole} from "boxrec-requests/dist/boxrec-requests.constants";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecParseBoutsParseBouts} from "../event/boxrec.parse.bouts.parseBouts";
import {BoxrecProfileRole, BoxrecProfileTable} from "./boxrec.profile.constants";

const profileTableEl: string = ".profileTable";

export abstract class BoxrecPageProfile extends BoxrecParseBoutsParseBouts {

    /**
     * The birth name of the person
     * @returns {string | null}
     */
    get birthName(): string | null {
        const birthName: string | void = this.parseProfileTableData(BoxrecProfileTable.birthName);

        if (birthName) {
            return birthName;
        }

        return null;
    }

    /**
     * Returns the place of which the person was born
     * @returns {string | null}
     */
    get birthPlace(): string | null {
        const birthPlace: string | void = this.parseProfileTableData(BoxrecProfileTable.birthPlace);

        if (birthPlace) {
            return this.$(`<div>${birthPlace}</div>`).text() || "";
        }

        return null;
    }

    /**
     * Returns the date of birth of the person
     * @example // Gennady Golovkin would return "1982-04-08"
     * this field is found on all profile types (ex. Lou Duva https://boxrec.com/en/promoter/24678)
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
     * Returns the date of the death
     */
    get death(): string | null {
        const death: string | void = this.parseProfileTableData(BoxrecProfileTable.death);

        // unsure the results if the person has a death date but no date of birth, we'll assume that the `age` part will
        // not be there
        if (death) {
            const splitDeath: string[] = death.split("/");

            if (splitDeath.length > 0) {
                return splitDeath[0].trim();
            }
        }

        return null;
    }

    /**
     * Returns the profile global id or id
     * @returns {number | null}
     */
    get globalId(): number | null {
        const tr: Cheerio = this.$(profileTableEl).find("h2");
        const id: RegExpMatchArray | null = tr.text().match(/\d+/);

        if (id) {
            const globalId: number = parseInt(id[0] as string, 10);
            if (!isNaN(globalId)) {
                return globalId;
            }
        }

        return null;
    }

    /**
     * Returns an object of various metadata
     * @returns {Object}
     */
    get metadata(): object | null {
        const metadata: string | null = this.$("script[type='application/ld+json']").html();
        if (metadata) {
            JSON.parse(metadata);
        }

        return null;
    }

    /**
     * Returns the full name
     * @returns {string}
     */
    get name(): string {
        return this.$(profileTableEl).find("h1").text();
    }

    /**
     * Additional info that was found on the profile but is unknown what to call it
     * @returns {string[][]}
     */
    get otherInfo(): string[][] {
        return this.parseOtherInfo();
    }

    get picture(): string {
        return this.$(".profileTablePhoto img").attr("src");
    }

    /**
     * Returns the current residency of the person
     * @returns {string | null}
     */
    get residence(): string | null {
        const residence: string | void = this.parseProfileTableData(BoxrecProfileTable.residence);

        if (residence) {
            return this.$(`<div>${residence}</div>`).text() || "";
        }

        return null;
    }

    /**
     * Returns the Boxrec Role value because the values in the HTML might change and not the text
     * ex. proboxer -> Pro Boxing.  therefore to keep tests passing, return the `proboxer` role
     */
    get role(): BoxrecProfileRole[] {
        const rolesWithLinks: BoxrecProfileRole[] = [];
        const parentEl: Cheerio = this.$(profileTableEl).find("h2").parent();

        // if they have one role they have this element, other they don't
        const profileOneRole: Cheerio = parentEl.find(".profileP");

        // current role (might not exist if they have one role
        const currentRole: Cheerio = parentEl.find(".profileIcon");

        if (currentRole.length || profileOneRole.length) {
            const canonicalLinkMatches: RegExpMatchArray | null = this.$("link[rel='canonical']").attr("href")
                .match(/\/en\/(\w+)\/\d+/);

            if (canonicalLinkMatches && canonicalLinkMatches.length) {
                rolesWithLinks.push({
                    id: this.globalId,
                    name: canonicalLinkMatches[1] as BoxrecRole,
                });
            } else {
                throw new Error(`Could not get BoxRec role?: ${this.globalId}`);
            }
        }

        // other roles
        parentEl.find("a").each((index: number, elem: CheerioElement) => {
            const hrefMatches: RegExpMatchArray | null = elem.attribs.href.match(/(\d+)$/);
            const type: string = trimRemoveLineBreaks(this.$(elem).text());

            if (hrefMatches && type) {
                rolesWithLinks.push({
                    id: parseInt(hrefMatches[1], 10),
                    name: type as BoxrecRole,
                });
            }
        }).get();

        // sort so `name` is in order
        rolesWithLinks.sort((a: BoxrecProfileRole, b: BoxrecProfileRole) => {
            if (a.name > b.name) {
                return 1;
            }

            if (a.name < b.name) {
                return -1;
            }

            return 0;
        });

        return rolesWithLinks;
    }

    /**
     * Returns whether the person is active or inactive in boxing
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

    private get profileTableBody(): Cheerio {
        return this.$(profileTableEl).find(`table.rowTable tbody`);
    }

    /**
     * Returns bout information in an array
     * @param boutsListArr  Array of bouts
     * @param {{new(boxrecBodyBout: string, additionalData: (string | null)): U}} type  this variable is a class that is instantiated
     * a class is passed in and an array of that instantiated class is passed back
     * https://blog.rsuter.com/how-to-instantiate-a-generic-type-in-typescript/
     * @hidden
     * @returns {U[]}
     */
    protected getBouts<U>(boutsListArr: Array<[string, string | null]>, type: (new (boxrecBodyBout: string, additionalData: string | null) => U)): U[] {
        return boutsListArr.map((val: [string, string | null]) => new type(val[0], val[1]));
    }

    /**
     * Parses the bout information for the person
     * @hidden
     */
    protected parseBouts(tr: Cheerio): Array<[string, string | null]> {
        return this.returnBouts(tr);
    }

    /**
     * Parses the profile table data found at the top of the profile
     * @hidden
     */
    protected parseProfileTableData(keyToRetrieve?: BoxrecProfileTable): string | void {
        const tableRow: Cheerio = this.profileTableBody.find(`tr:contains("${keyToRetrieve}")`);
        const val: string | null = tableRow.find("td:nth-child(2)").html();

        if (keyToRetrieve && val) {
            return val.trim();
        }
    }

    private parseOtherInfo(): Array<[string, string]> {
        const otherInfo: Array<[string, string]> = [];
        const knownTableColumnKeys: string[] = Object.values(BoxrecProfileTable);
        this.profileTableBody.find("tr").each((i: number, elem: CheerioElement) => {
            const val: string | null = this.$(elem).find("td:nth-child(2)").html();
            const key: string | null = trimRemoveLineBreaks(this.$(elem).find("td:nth-child(1)").text());

            // key.subtr because we don't want to match the `ID #` table row
            if (key && val && key.substr(0, 2) !== "ID" && !knownTableColumnKeys.includes(key)) {
                otherInfo.push([key, val]);
            }
        });

        return otherInfo;
    }
}
