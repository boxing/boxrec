import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic} from "../boxrec.constants";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * parse a BoxRec Title page
 * <pre>ex. http://boxrec.com/en/title/6/Middleweight
 */
export class BoxrecPageTitle {

    private _name: string;
    private _champion: string | null;
    private _numberOfBouts: string;
    private _bouts: [string, string | null][] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);

        this.parse();
        this.parseBouts();
    }

    get name(): string {
        return trimRemoveLineBreaks(this._name);
    }

    /**
     * Return id and name of current champion.  Will return null if title is vacant
     * @returns {BoxrecBasic | null}
     */
    get champion(): BoxrecBasic {
        const html: Cheerio = $(`<div>${this._champion}</div>`);
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

    get numberOfBouts(): number {
        return parseInt(this._numberOfBouts, 10);
    }

    get bouts(): BoxrecPageTitleRow[] {
        const bouts: [string, string | null][] = [] = this._bouts;
        const boutsList: BoxrecPageTitleRow[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecPageTitleRow = new BoxrecPageTitleRow(val[0], val[1]);
            boutsList.push(bout);
        });

        return boutsList;
    }

    private parse(): void {
        this._name = $("h1").text();
        this._champion = $("#pageOuter h2").html();
        this._numberOfBouts = $(".pagerResults").text();
    }

    // todo this is extremely similar to boxrec.page.event.ts, can we merge?
    private parseBouts(): void {
        const tr: Cheerio = $("table#boutTable > tbody tr");
        $(tr).each((i: number, elem: CheerioElement) => {
            const boutId: string = $(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (!boutId || boutId.includes("second")) {
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
            this._bouts.push([html, next]);
        });

    }
}