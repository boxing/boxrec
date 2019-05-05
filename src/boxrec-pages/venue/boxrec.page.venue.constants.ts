import {BoxrecLocation} from "../boxrec.constants";

export interface BoxrecVenueOutput {
    events: BoxrecPageVenueEventsRowOutput[];
    localBoxers: Array<{ id: number, name: string }>;
    localManagers: Array<{ id: number, name: string }>;
    location: BoxrecLocation;
    name: string;
}

export interface BoxrecPageVenueEventsRowOutput {
    date: string;
    day: string;
    id: number | null;
    location: BoxrecLocation;
}
