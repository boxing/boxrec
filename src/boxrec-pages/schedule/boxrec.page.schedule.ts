import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {stripCommas} from "../../helpers";
import {BoxrecEventOutput} from "../event/boxrec.event.constants";
import {BoxrecPageEvent} from "../event/boxrec.page.event";
import {BoxrecPageScheduleCommon} from "./boxrec.page.schedule.common";
import {BoxrecScheduleOutput} from "./boxrec.page.schedule.constants";

/**
 * BoxRec Results/Schedule Page
 * <pre>ex. http://boxrec.com/en/schedule?c%5BcountryCode%5D=&c%5Bdivision%5D=Light+Middleweight&c%5Btv%5D=&c_go=</pre>
 * <pre>ex. http://boxrec.com/en/results?c%5BcountryCode%5D=US&c%5Bdivision%5D=Middleweight&c_go=</pre>
 */
@OutputGetter([
    {
        function: (events: BoxrecPageEvent[]): BoxrecEventOutput[] => events.map(eventRow => eventRow.output),
        method: "events",
    },
    "numberOfPages",
])
export class BoxrecPageSchedule extends BoxrecPageScheduleCommon implements OutputInterface {

    output: BoxrecScheduleOutput;

    get events(): BoxrecPageEvent[] {
        const el: Cheerio = this.$(".calendarTable:nth-child(1) thead:nth-child(2)");
        const headers: string = `<thead>${el.html()}</thead>`;

        return this.parse(headers).map((event: string) => new BoxrecPageEvent(event));
    }

    get numberOfPages(): number {
        const text: string = this.$(".filterBarFloat .pagerElement:nth-last-child(3)").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

}
