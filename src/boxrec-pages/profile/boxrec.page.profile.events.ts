import {ListingsGetter, ListingsInterface} from "../../decorators/listings.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileEventsOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";

/**
 * Parses profiles that have events listed
 */
@ListingsGetter("events", BoxrecPageProfileEventRow, ".dataTable")
@OutputGetter(["birthName", "birthPlace", "events", "globalId", "name", "otherInfo",
    "picture", "residence", "role", "status"])
export class BoxrecPageProfileEvents extends BoxrecPageProfile implements ListingsInterface, OutputInterface {

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns array of passed in class
     */
    events: BoxrecPageProfileEventRow[];
    output: BoxrecProfileEventsOutput;

}
