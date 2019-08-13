import {BoxrecPageScheduleCommon} from "../schedule/boxrec.page.schedule.common";
import {BoxrecDateEvent} from "./boxrec.date.event";
import {BoxrecDateOutput} from "./boxrec.page.date.constants";

/**
 * Parse a BoxRec date page
 */
export class BoxrecPageDate extends BoxrecPageScheduleCommon {

    get events(): BoxrecDateEvent[] {
        return this.parse(true).map((event: string) => new BoxrecDateEvent(event));
    }

    get output(): BoxrecDateOutput {
        return {
            events: this.events,
        };
    }

}
