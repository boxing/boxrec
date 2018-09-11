import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic} from "../boxrec.constants";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";

const cheerio: CheerioAPI = require("cheerio");

/**
 * parse a BoxRec Title page
 * <pre>ex. http://boxrec.com/en/title/6/Middleweight
 */
export class BoxrecPageTitle {

    private $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * A list of bouts that have occurred for this title.  Most recent
     * @returns {BoxrecPageTitleRow[]}
     */
    get bouts(): BoxrecPageTitleRow[] {
        const bouts: Array<[string, string | null]> = [] = this.parseBouts();
        const boutsList: BoxrecPageTitleRow[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecPageTitleRow = new BoxrecPageTitleRow(val[0], val[1]);
            boutsList.push(bout);
        });

        return boutsList;
    }

    /**
     * Return id and name of current champion
     * @returns {BoxrecBasic}
     */
    get champion(): BoxrecBasic {
        const championStr: string | null = this.$("#pageOuter h2").html();
        const html: Cheerio = this.$(`<div>${championStr}</div>`);
        const boxerLink: Cheerio = html.find("a");

        if (boxerLink) {
            const link: CheerioElement = boxerLink.get(0);
            const href: RegExpMatchArray | null = link.attribs.href.match(/(\d+)$/);

            if (href && href[1]) {
                return {
                    id: parseInt(href[1], 10),
                    name: trimRemoveLineBreaks(html.text()),
                };
            }
        }

        return {
            id: null,
            name: null,
        };
    }

    get name(): string {
        const name: string = this.$("h1").text();
        return trimRemoveLineBreaks(name);
    }

    /**
     * The number of bouts that have occurred for this title
     * @returns {number}
     */
    get numberOfBouts(): number {
        return parseInt(this.$(".pagerResults").text(), 10);
    }

    // todo this is extremely similar to boxrec.page.event.ts, can we merge?
    private parseBouts(): Array<[string, string | null]> {
        const tr: Cheerio = this.$(".dataTable > tbody tr");
        const bouts: Array<[string, string | null]> = [];

        this.$(tr).each((i: number, elem: CheerioElement) => {
            const boutId: string = this.$(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (!boutId || boutId.includes("second")) {
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
            bouts.push([html, next]);
        });

        return bouts;
    }
}
