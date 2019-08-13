import {BoxrecBasic, BoxrecLocation} from "../../boxrec.constants";

export interface BoxrecPageLocationEventRowOutput {
    date: string;
    day: string;
    id: number | null;
    location: BoxrecLocation;
    venue: BoxrecBasic;
}

export interface BoxrecPageLocationEventOutput {
    events: BoxrecPageLocationEventRowOutput[];
    numberOfLocations: number;
}
