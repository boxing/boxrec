import {Country} from "boxrec-requests";

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
