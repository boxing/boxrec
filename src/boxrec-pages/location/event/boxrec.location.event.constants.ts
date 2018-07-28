import {Country} from "../people/boxrec.location.people.constants";

export interface BoxrecLocationEventParams {
    country?: Country;
    offset?: number;
    region?: string;
    town?: string;
    venue?: string;
    year?: number;
}
