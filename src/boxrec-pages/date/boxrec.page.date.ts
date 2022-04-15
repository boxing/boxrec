import { EventsBoutsGetter, EventsBoutsInterface } from "../../decorators/events.bouts.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {BoxrecPageScheduleCommon} from "../schedule/boxrec.page.schedule.common";
import {BoxrecDateEvent} from "./boxrec.date.event";
import {BoxrecDateOutput} from "./boxrec.page.date.constants";

/**
 * Parse a BoxRec date page
 */
@EventsBoutsGetter(BoxrecDateEvent)
@OutputGetter(["events"])
export class BoxrecPageDate extends BoxrecPageScheduleCommon
    implements EventsBoutsInterface, OutputInterface {

    events: BoxrecDateEvent[];
    output: BoxrecDateOutput;
}
