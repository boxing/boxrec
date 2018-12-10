import * as cheerio from "cheerio";
import {BoxrecPageScheduleCommon} from "../schedule/boxrec.page.schedule.common";
import {BoxrecDateEvent} from "./boxrec.date.event";

/**
 * Parse a BoxRec date page
 */
export class BoxrecPageDate extends BoxrecPageScheduleCommon {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get events(): BoxrecDateEvent[] {
        return this.parse().map((event: string) => new BoxrecDateEvent(event));
    }

}
