import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecPageVenueEventsRow} from "./boxrec.page.venue.events.row";

export interface BoxrecVenueOutput {
    events: BoxrecPageVenueEventsRow[];
    localBoxers: Array<{ id: number, name: string }>;
    localManagers: Array<{ id: number, name: string }>;
    location: BoxrecLocation;
    name: string;
}
