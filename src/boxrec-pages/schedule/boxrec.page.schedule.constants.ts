import {BoxrecPageEvent} from "@boxrec-pages/event/boxrec.page.event";

export interface BoxrecScheduleOutput {
    events: BoxrecPageEvent[];
    numberOfPages: number;
}