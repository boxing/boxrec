import {BoxrecBasic, BoxrecLocation} from "../../boxrec.constants";
import {Country} from "../people/boxrec.location.people.constants";

export interface BoxrecLocationEventParams {
    country?: Country;
    offset?: number;
    region?: string;
    town?: string;
    venue?: string;
    year?: number;
}

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
