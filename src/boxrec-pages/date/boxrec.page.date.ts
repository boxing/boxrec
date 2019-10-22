import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {BoxrecPageScheduleCommon} from "../schedule/boxrec.page.schedule.common";
import {BoxrecDateEvent} from "./boxrec.date.event";
import {BoxrecDateOutput} from "./boxrec.page.date.constants";

/**
 * Parse a BoxRec date page
 */
@OutputGetter(["events"])
export class BoxrecPageDate extends BoxrecPageScheduleCommon
    implements OutputInterface {

    output: BoxrecDateOutput;

    get events(): BoxrecDateEvent[] {
        return this.parse(true).map((event: string) => new BoxrecDateEvent(event));
    }

}
