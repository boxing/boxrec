import {Country} from "../people/boxrec.location.people.constants";

export interface BoxrecLocationEventParams {
    country?: Country;
    region?: string;
    town?: string;
    venue?: string;
    year?: number;
}