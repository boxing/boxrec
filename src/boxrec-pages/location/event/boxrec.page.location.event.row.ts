import {DateGetter, DateInterface} from "../../../decorators/date.decorator";
import {DayGetter, DayInterface} from "../../../decorators/day.decorator";
import {IdGetter} from "../../../decorators/id.decorator";
import {LocationGetter} from "../../../decorators/location.decorator";
import {OutputGetter, OutputInterface} from "../../../decorators/output.decorator";
import {BoxrecCommonTableHeader} from "../../../helpers";
import {BoxrecLocation} from "../../boxrec.constants";
import {BoxrecPageLocationEventRowOutput} from "./boxrec.location.event.constants";
import {BoxrecPageEventCommonRow} from "./boxrec.page.event.common.row";

@DateGetter()
@DayGetter()
@IdGetter(BoxrecCommonTableHeader.links)
@LocationGetter(2)
@OutputGetter(["date", "day", "id", "location", "venue"])
export class BoxrecPageLocationEventRow extends BoxrecPageEventCommonRow implements DateInterface, DayInterface,
    OutputInterface {

    date: string;
    day: string;
    location: BoxrecLocation;
    id: number | null;
    output: BoxrecPageLocationEventRowOutput;

}
