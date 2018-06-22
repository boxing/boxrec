import {Country} from "../location/people/boxrec.location.people.constants";

export interface BoxrecScheduleParams {
    countryCode?: Country;
    division?: string;
    tv?: string;
    offset?: number;
}

export interface BoxrecScheduleParamsTransformed {
    "c[countryCode]"?: Country;
    "c[division]"?: string;
    "c[tv]"?: string;
    offset?: number;
}