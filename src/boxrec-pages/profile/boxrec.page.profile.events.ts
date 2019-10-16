import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileEventsOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";
import {EventsGetter, EventsInterface} from "../../decorators/events.decorator";

/**
 * Parses profiles that have events listed
 */
@EventsGetter(BoxrecPageProfileEventRow, ".dataTable")
export class BoxrecPageProfileEvents extends BoxrecPageProfile implements EventsInterface {

    /**
     * Returns a list of events
     * is order from most recent to oldest
     * @returns array of passed in class
     */
    events: BoxrecPageProfileEventRow[];

    get output(): BoxrecProfileEventsOutput {
        return {
            birthName: this.birthName,
            birthPlace: this.birthPlace,
            events: this.events,
            globalId: this.globalId,
            name: this.name,
            otherInfo: this.otherInfo,
            picture: this.picture,
            residence: this.residence,
            role: this.role,
            status: this.status,
        };
    }

}
