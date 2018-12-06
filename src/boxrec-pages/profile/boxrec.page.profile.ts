import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {Location} from "../boxrec.constants";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");

export abstract class BoxrecPageProfile {

    protected readonly $: CheerioStatic;

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
        const tr: Cheerio = this.$(".profileTable table.rowTable tbody tr");
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
        return this.parseOtherInfo();
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

    private get profileTableBody(): Cheerio {
        return this.$(`.profileTable table.rowTable tbody`);
    }

    /**
     * Returns bout information in an array
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
        const boutsList: Array<[string, string | null]> = [];

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
            boutsList.push([html, next]);
        });

        return boutsList;
    }

    /**
     * Parses the profile table data found at the top of the profile
     * @hidden
     */
    protected parseProfileTableData(keyToRetrieve?: BoxrecProfileTable): string | void {
        // todo this should be looking for td:nth-child(1) and :contains
        const tableRow: Cheerio = this.profileTableBody.find(`tr:contains("${keyToRetrieve}")`);
        const val: string | null = tableRow.find("td:nth-child(2)").html();

        if (keyToRetrieve && tableRow && val) {
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
