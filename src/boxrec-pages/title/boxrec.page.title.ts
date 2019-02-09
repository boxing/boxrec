import {BoxrecBasic} from "@boxrec-constants";
import {BoxrecTitleOutput} from "@boxrec-pages/title/boxrec.page.title.constants";
import {trimRemoveLineBreaks} from "@helpers";
import * as cheerio from "cheerio";
import {BoxrecParseBouts} from "../event/boxrec.parse.bouts";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";

/**
 * parse a BoxRec Title page
 * <pre>ex. http://boxrec.com/en/title/6/Middleweight
 */
export class BoxrecPageTitle extends BoxrecParseBouts {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * A list of bouts that have occurred for this title.  Most recent
     * @returns {BoxrecPageTitleRow[]}
     */
    get bouts(): BoxrecPageTitleRow[] {
        return this.parseBouts().map((val: [string, string | null]) => new BoxrecPageTitleRow(val[0], val[1]));
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
        return trimRemoveLineBreaks(this.$("h1").text());
    }

    get output(): BoxrecTitleOutput {
        return {
            bouts: this.bouts,
            champion: this.champion,
            name: this.name,
            numberOfBouts: this.numberOfBouts,
        };
    }

}
