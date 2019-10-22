import {BoutsGetter, BoutsInterface} from "../../decorators/bouts.decorator";
import {stripCommas} from "../../helpers";
import {BoxrecParseBouts} from "../event/boxrec.parse.bouts";
import {BoxrecTitlesOutput} from "./boxrec.page.title.constants";
import {BoxrecPageTitlesRow} from "./boxrec.page.titles.row";

/**
 * parse a BoxRec Titles page (different from Title page)
 * <pre>ex. http://boxrec.com/en/titles?WcX%5Bbout_title%5D=72&WcX%5Bdivision%5D=Super+Middleweight&t_go=</pre>
 */
@BoutsGetter(".dataTable", BoxrecPageTitlesRow)
export class BoxrecPageTitles extends BoxrecParseBouts
    implements BoutsInterface {

    bouts: BoxrecPageTitlesRow[];

    get numberOfPages(): number {
        const text: string = this.$(".filterBarFloat .pagerElement:nth-last-child(3)").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

    get output(): BoxrecTitlesOutput {
        return {
            bouts: this.bouts.map(bout => bout.output),
            numberOfBouts: this.numberOfBouts,
            numberOfPages: this.numberOfPages,
        };
    }

}
