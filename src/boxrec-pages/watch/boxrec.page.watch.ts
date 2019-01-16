import * as cheerio from "cheerio";
import {BoxrecPageWatchRow} from "./boxrec.page.watch.row";

export class BoxrecPageWatch {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    /**
     * Returns true if the boxer exists in the list
     * @param {number} boxerGlobalId
     * @returns {boolean}
     */
    checkForBoxerInList(boxerGlobalId: number): boolean {
        return !!this.list().find((item: BoxrecPageWatchRow) => item.globalId === boxerGlobalId);
    }

    list(): BoxrecPageWatchRow[] {
        const listOfWatchedBoxers: BoxrecPageWatchRow[] = [];

        this.$("table tr").each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            if (!html.includes("<th>")) {
                const boxerRow: BoxrecPageWatchRow = new BoxrecPageWatchRow(html);

                // you can screw with BoxRec by watching `0` and it leaves you with an `unknown` boxer
                // only add boxers that are real rows
                if (boxerRow.globalId) {
                    listOfWatchedBoxers.push(new BoxrecPageWatchRow(html));
                }
            }
        });

        return listOfWatchedBoxers;
    }

}