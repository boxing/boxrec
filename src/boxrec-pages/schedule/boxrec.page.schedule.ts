import {BoxrecScheduleOutput} from "@boxrec-pages/schedule/boxrec.page.schedule.constants";
import {stripCommas} from "@helpers";
import * as cheerio from "cheerio";
import {BoxrecPageEvent} from "../event/boxrec.page.event";
import {BoxrecPageScheduleCommon} from "./boxrec.page.schedule.common";

/**
 * BoxRec Results/Schedule Page
 * <pre>ex. http://boxrec.com/en/schedule?c%5BcountryCode%5D=&c%5Bdivision%5D=Light+Middleweight&c%5Btv%5D=&c_go=</pre>
 * <pre>ex. http://boxrec.com/en/results?c%5BcountryCode%5D=US&c%5Bdivision%5D=Middleweight&c_go=</pre>
 */
export class BoxrecPageSchedule extends BoxrecPageScheduleCommon {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get events(): BoxrecPageEvent[] {
        return this.parse().map((event: string) => new BoxrecPageEvent(event));
    }

    get numberOfPages(): number {
        const text: string = this.$(".filterBarFloat .pagerElement:nth-last-child(3)").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

    get output(): BoxrecScheduleOutput {
        return {
            events: this.events,
            numberOfPages: this.numberOfPages,
        };
    }
}
