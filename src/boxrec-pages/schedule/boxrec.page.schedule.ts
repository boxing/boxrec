import { EventsBoutsGetter, EventsBoutsInterface } from "../../decorators/events.bouts.decorator";
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
@EventsBoutsGetter(BoxrecPageEvent)
@OutputGetter([
    {
        function: (events: BoxrecPageEvent[]): BoxrecEventOutput[] => events.map(eventRow => eventRow.output),
        method: "events",
    },
    "numberOfPages",
])
export class BoxrecPageSchedule extends BoxrecPageScheduleCommon implements EventsBoutsInterface, OutputInterface {

    events: BoxrecPageEvent[];
    output: BoxrecScheduleOutput;

    get numberOfPages(): number {
        const text: string = this.$(".filterBarFloat .pagerElement:nth-last-child(3)").text() || "0";
        return parseInt(stripCommas(text), 10);
    }

}
