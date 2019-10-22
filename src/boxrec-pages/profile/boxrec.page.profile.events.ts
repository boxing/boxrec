import {EventsGetter, EventsInterface} from "../../decorators/events.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileEventsOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";

/**
 * Parses profiles that have events listed
 */
@EventsGetter(BoxrecPageProfileEventRow, ".dataTable")
@OutputGetter(["birthName", "birthPlace", "events", "globalId", "name", "otherInfo",
    "picture", "residence", "role", "status"])
export class BoxrecPageProfileEvents extends BoxrecPageProfile implements EventsInterface, OutputInterface {

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns array of passed in class
     */
    events: BoxrecPageProfileEventRow[];
    output: BoxrecProfileEventsOutput;

}
