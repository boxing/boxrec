import {replaceWithWeight, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic} from "../boxrec.constants";
import {BoxrecParseBouts} from "../event/boxrec.parse.bouts";
import {BoxrecTitleOutput} from "./boxrec.page.title.constants";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";
import {BoxrecPageTitlesRow} from "../titles/boxrec.page.titles.row";
import {BoutsGetter, BoutsInterface} from "../../decorators/bouts.decorator";

/**
 * parse a BoxRec Title page
 * <pre>ex. http://boxrec.com/en/title/6/Middleweight
 */
@BoutsGetter("table", BoxrecPageTitlesRow)
export class BoxrecPageTitle extends BoxrecParseBouts implements BoutsInterface {

    /**
     * A list of bouts that have occurred for this title.  Most recent
     * @returns {BoxrecPageTitleRow[]}
     */
    bouts: BoxrecPageTitlesRow[];

    /**
     * The number of bouts that have occurred for this title
     * @returns {number}
     */
    get numberOfBouts(): number {
        return parseInt(this.$(".pagerResults").text(), 10);
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
        return replaceWithWeight(this.$("#pageOuter h1").text());
    }

    get output(): BoxrecTitleOutput {
        return {
            bouts: this.bouts.map(bout => bout.output),
            champion: this.champion,
            name: this.name,
            numberOfBouts: this.numberOfBouts,
        };
    }

}
