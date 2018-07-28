import {BoxrecResultsParams, BoxrecResultsParamsTransformed} from "../results/boxrec.results.constants";

export interface BoxrecScheduleParams extends BoxrecResultsParams {
    tv?: string;
}

export interface BoxrecScheduleParamsTransformed extends BoxrecResultsParamsTransformed {
    "c[tv]"?: string;
}
