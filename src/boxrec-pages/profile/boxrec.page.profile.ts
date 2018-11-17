import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {Location} from "../boxrec.constants";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");

export abstract class BoxrecPageProfile {

    protected readonly $: CheerioStatic;
    /**
     * @hidden
     */
    protected _boutsList: Array<[string, string | null]> = [];
    /**
     * other stuff that we haven't seen yet
     * @hidden
     */
    protected _otherInfo: Array<[string, string]> = [];
    /**
     * @hidden
     */
        // todo required for parsing the `profileTable` for the time being
    protected _ranking: string;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

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
     * Returns the country of which the person was born
     * @returns {Location}
     */
    get birthPlace(): Location {
        let birthPlace: string = this.parseProfileTableData(BoxrecProfileTable.birthPlace) || "";
        birthPlace = `<div>${birthPlace}</div>`;
        return BoxrecCommonTablesColumnsClass.parseLocationLink(birthPlace);
    }

    /**
     * Returns the profile global id or id
     * @returns {number | null}
     */
    get globalId(): number | null {
        const tr: Cheerio = this.getProfileTableRows();
        const id: RegExpMatchArray | null = tr.find("h2").text().match(/\d+/);

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
        return this.$("h1").text();
    }

    /**
     * Additional info that was found on the profile but is unknown what to call it
     * @returns {string[][]}
     */
    get otherInfo(): string[][] {
        return this._otherInfo;
    }

    /**
     * Returns the current residency of the person
     * @returns {Location}
     */
    get residence(): Location {
        let residence: string = this.parseProfileTableData(BoxrecProfileTable.residence) || "";
        residence = `<div>${residence}</div>`;
        return BoxrecCommonTablesColumnsClass.parseLocationLink(residence);
    }

    /**
     * Returns the entire string of roles this person has
     * @returns {string | null}
     */
    get role(): string | null {
        const role: string = this.$(this.parseProfileTableData(BoxrecProfileTable.role)).text(); // todo if boxer is promoter as well, should return promoter link

        if (role) {
            return role;
        }

        return null;
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

    /**
     * Returns bout information in an array
     * @param {{new(boxrecBodyBout: string, additionalData: (string | null)): U}} type  this variable is a class that is instantiated
     * a class is passed in and an array of that instantiated class is passed back
     * https://blog.rsuter.com/how-to-instantiate-a-generic-type-in-typescript/
     * @hidden
     * @returns {U[]}
     */
    protected getBouts<U>(type: (new (boxrecBodyBout: string, additionalData: string | null) => U)): U[] {
        const bouts: Array<[string, string | null]> = this._boutsList;
        const boutsList: U[] = [];

        bouts.forEach((val: [string, string | null]) => {
            const bout: U = new type(val[0], val[1]);
            boutsList.push(bout);
        });

        return boutsList;
    }

    /**
     * Parses the bout information for the person
     * @hidden
     */
    // todo move ? is used where
    protected parseBouts(tr: Cheerio): void {
        tr.each((i: number, elem: CheerioElement) => {
            const boutId: string = this.$(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (boutId.includes("second")) {
                return;
            }

            // we need to check to see if the next row is associated with this bout
            let isNextRowAssociated: boolean = false;
            let nextRow: Cheerio | null = this.$(elem).next();
            let nextRowId: string = nextRow.attr("id");

            if (nextRowId) {
                nextRowId = nextRowId.replace(/[a-zA-Z]/g, "");

                isNextRowAssociated = nextRowId === boutId;
                if (!isNextRowAssociated) {
                    nextRow = null;
                }
            } // else if no next bout exists

            const html: string = this.$(elem).html() || "";
            const next: string | null = nextRow ? nextRow.html() : null;
            this._boutsList.push([html, next]);
        });
    }

    /**
     * Parses the profile table data found at the top of the profile
     * @hidden
     */
    protected parseProfileTableData(keyToRetrieve?: BoxrecProfileTable): string | void {
        // todo this should be looking for td:nth-child(1) and :contains
        const tableRow: Cheerio = this.$(`.profileTable table.rowTable tbody tr:contains("${keyToRetrieve}")`);
        const val: string | null = tableRow.find("td:nth-child(2)").html();
        const key: string | null = tableRow.find("td:nth-child(1)").text();

        if (keyToRetrieve) {

            if (tableRow) {

                if (val) {
                    return val.trim();
                }
            } else {
                if (keyToRetrieve === BoxrecProfileTable.ranking) {
                    // todo do better to remove this _ranking variable

                } else {
                    // either an error or returned something we haven't mapped
                    if (key && val) {
                        this._otherInfo.push([key, val]);
                    }
                }
            }

        }

    }

    private getProfileTableRows(): Cheerio {
        return this.$(".profileTable table.rowTable tbody tr");
    }

}
