import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecParseBoutsParseBouts} from "../event/boxrec.parse.bouts.parseBouts";
import {BoxrecRole} from "../search/boxrec.search.constants";
import {BoxrecProfileRole, BoxrecProfileTable} from "./boxrec.profile.constants";

export abstract class BoxrecPageProfile extends BoxrecParseBoutsParseBouts {

    protected readonly $: CheerioStatic;

    protected constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
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
     * @returns {BoxrecLocation}
     */
    get birthPlace(): BoxrecLocation {
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

    get picture(): string {
        return this.$(".profileTablePhoto img").attr("src");
    }

    /**
     * Returns the current residency of the person
     * @returns {BoxrecLocation}
     */
    get residence(): BoxrecLocation {
        let residence: string = this.parseProfileTableData(BoxrecProfileTable.residence) || "";
        residence = `<div>${residence}</div>`;
        return BoxrecCommonTablesColumnsClass.parseLocationLink(residence);
    }

    /**
     * Returns an array of BoxRec roles in order by the role name
     * Contains all ids as there may be a possibility of different ids
     * @returns {BoxrecProfileRole[]}
     */
    get role(): BoxrecProfileRole[] {
        const role: Cheerio = this.$(`<div>${this.parseProfileTableData(BoxrecProfileTable.role)}</div>`);
        const rolesStr: string = this.$(`<div>${this.parseProfileTableData(BoxrecProfileTable.role)}</div>`).text();
        const rolesWithLinks: BoxrecProfileRole[] = [];

        if (role) {
            const rolesStrSplit: string[] = rolesStr.split(" ");

            this.$(role).find("a").each((index: number, elem: CheerioElement) => {
                const hrefMatches: RegExpMatchArray | null = elem.attribs.href.match(/(\d+)$/);
                const type: string = this.$(elem).text();

                if (hrefMatches && type) {
                    rolesWithLinks.push({
                        id: parseInt(hrefMatches[1], 10),
                        name: type as BoxrecRole,
                    });
                }
            }).get();

            // if a boxer is a boxer and promoter, and it's the boxer's profile page.  The `boxer` text will just be text and not a link
            // loop through and convert any to links as well.  There should only be one that is text
            for (const roleName of rolesStrSplit) {
                const found: boolean = !!rolesWithLinks.find(item => item.name === roleName);

                if (!found) {
                    rolesWithLinks.push({
                        id: this.globalId,
                        name: roleName as BoxrecRole,
                    });
                }
            }

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
        }

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
        return this.$(`.profileTable table.rowTable tbody`);
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
