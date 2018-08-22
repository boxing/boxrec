import {Country} from "../location/people/boxrec.location.people.constants";

export interface BoxrecResultsParams {
    countryCode?: Country;
    division?: string;
    offset?: number;
}

export interface BoxrecResultsParamsTransformed {
    "c[countryCode]"?: Country;
    "c[division]"?: string;
    offset?: number;
}
