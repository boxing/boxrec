import {BoxrecProfileTable} from "./boxrec.profile.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export abstract class BoxrecPageProfile {

    /**
     * @hidden
     */
    protected _alias: string;
    /**
     * @hidden
     */
    protected _birthName: string;
    /**
     * @hidden
     */
    protected _birthPlace: string;
    /**
     * @hidden
     */
    protected _born: string;
    /**
     * @hidden
     */
    protected _boutsList: Array<[string, string | null]> = [];
    /**
     * @hidden
     */
    protected _debut: string;
    /**
     * @hidden
     */
    protected _globalId: string;
    /**
     * @hidden
     */
    protected _metadata: string;
    /**
     * @hidden
     */
    protected _name: string | null;
    /**
     * @hidden
     */
    protected _nationality: string;
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
    /**
     * @hidden
     */
    protected _residence: string;
    /**
     * @hidden
     */
    protected _role: string;
    /**
     * @hidden
     */
    protected _status: string;

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
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
     * Returns an object of various metadata
     * @returns {Object}
     */
    get metadata(): any {
        return JSON.parse(this._metadata);
    }

    /**
     * Returns the full name
     * @returns {string | null}
     */
    get name(): string | null {
        return this._name || null;
    }

    set name(name: string | null) {
        this._name = name;
    }

    /**
     * Returns bout information in an array
     * @param {{new(boxrecBodyBout: string, additionalData: (string | null)): T}} type  this variable is a class that is instantiated
     * a class is passed in and an array of that instantiated class is passed back
     * https://blog.rsuter.com/how-to-instantiate-a-generic-type-in-typescript/
     * @hidden
     * @returns {T[]}
     */
    getBouts<T>(type: (new (boxrecBodyBout: string, additionalData: string | null) => T)): T[] {
        const bouts: Array<[string, string | null]> = this._boutsList;
        const boutsList: T[] = [];

        bouts.forEach((val: [string, string | null]) => {
            const bout: T = new type(val[0], val[1]);
            boutsList.push(bout);
        });

        return boutsList;
    }

    /**
     * Parses the bout information for the person
     * @hidden
     */
    protected parseBouts(tr: Cheerio): void {
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

    /**
     * @hidden
     */
    protected parseName(): void {
        this.name = $("h1").text();
    }

    /**
     * Parses the profile table data found at the top of the profile
     * @hidden
     */
    protected parseProfileTableData(): void {
        const tr: Cheerio = $(".profileTable table.rowTable tbody tr");

        const id: RegExpMatchArray | null = tr.find("h2").text().match(/\d+/);

        const d = tr.find("h2").length;

        if (id && id.length) {
            this._globalId = id[0];
        }

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

}
