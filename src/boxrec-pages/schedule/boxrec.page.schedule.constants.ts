import {BoxrecEventOutput} from '../event/boxrec.event.constants';

export interface BoxrecScheduleOutput {
    events: BoxrecEventOutput[];
    numberOfPages: number;
}
