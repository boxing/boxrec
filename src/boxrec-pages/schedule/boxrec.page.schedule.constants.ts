import {BoxrecPageEvent} from "../event/boxrec.page.event";

export interface BoxrecScheduleOutput {
    events: BoxrecPageEvent[];
    numberOfPages: number;
}
