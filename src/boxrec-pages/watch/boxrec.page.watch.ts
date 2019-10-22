import * as cheerio from "cheerio";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {BoxrecPageWatchRow} from "./boxrec.page.watch.row";
import {BoxrecWatchOutput} from "./boxrec.watch.constants";

@OutputGetter([{
    function: (list: BoxrecPageWatchRow[]) => list.map(item => item.output),
    method: "list"
}])
export class BoxrecPageWatch implements OutputInterface {

    output: BoxrecWatchOutput;

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get list(): BoxrecPageWatchRow[] {
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

    /**
     * Returns true if the boxer exists in the list
     * @param {number} boxerGlobalId
     * @returns {boolean}
     * // todo maybe this shouldn't be part of the class as it's not related
     */
    checkForBoxerInList(boxerGlobalId: number): boolean {
        return !!this.list.find((item: BoxrecPageWatchRow) => item.globalId === boxerGlobalId);
    }

}
