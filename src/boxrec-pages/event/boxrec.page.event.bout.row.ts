import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecBasic, BoxrecEventBout, Record, WinLossDraw} from "../boxrec.constants";

const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageEventBoutRow extends BoxrecCommonTablesClass {

    private _division: string;
    private _firstBoxer: string;
    private _firstBoxerRecord: string;
    private _firstBoxerLast6: string;
    private _links: string;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);

        this.parseBout();
        this.parseMetadata();
    }

    get get(): BoxrecEventBout {
        return {
            firstBoxer: this.firstBoxer,
            firstBoxerLast6: this.firstBoxerLast6,
            firstBoxerRecord: this.firstBoxerRecord,
            firstBoxerWeight: this.firstBoxerWeight,
            secondBoxer: this.secondBoxer,
            secondBoxerLast6: this.secondBoxerLast6,
            secondBoxerRecord: this.secondBoxerRecord,
            secondBoxerWeight: this.secondBoxerWeight,
            titles: this.titles,
            referee: this.referee,
            judges: this.judges,
            rating: this.rating,
            result: this.result,
            links: this.links,
            metadata: this.metadata,
        };
    }

    get division(): string {
        return this._division.trim();
    }

    get firstBoxer(): BoxrecBasic {
        return this.parseNameAndId(this._firstBoxer);
    }

    get firstBoxerRecord(): Record {
        return super.parseRecord(this._firstBoxerRecord);
    }

    get firstBoxerLast6(): WinLossDraw[] {
        return super.parseLast6Column(this._firstBoxerLast6);
    }

    // returns an object with keys that contain a class other than `primaryIcon`
    // not the exact same as the other page links
    get links(): any { // object of strings
        const html = $(this._links);
        const obj = {
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find(".desktop a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = $(elem).find("div");
            const href: string = $(elem).attr("href");
            const classAttr: string = div.attr("class");
            const hrefArr: string[] = classAttr.split(" ");

            hrefArr.forEach((cls: string) => {
                if (cls !== "primaryIcon") {
                    const matches = href.match(/(\d+)$/);
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

    private parseBout(): void {
        const getColumnData = (nthChild: number, returnHTML: boolean = true): string => {
            const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

            if (returnHTML) {
                return el.html() || "";
            }

            return el.text();
        };

        this._division = getColumnData(2, false);
        this._firstBoxer = getColumnData(3);
        this._firstBoxerWeight = getColumnData(4, false);
        this._firstBoxerRecord = getColumnData(5);
        this._firstBoxerLast6 = getColumnData(6);
        this._outcome = getColumnData(7, false);
        this._outcomeByWayOf = getColumnData(8);
        this._numberOfRounds = getColumnData(9);
        this._secondBoxer = getColumnData(10);
        this._secondBoxerWeight = getColumnData(11, false);
        this._secondBoxerRecord = getColumnData(12);
        this._secondBoxerLast6 = getColumnData(13);
        this._rating = getColumnData(14);
        this._links = getColumnData(15);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}