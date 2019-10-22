import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsActiveInactiveDivisionRow} from "./boxrec.page.ratings.active-inactive-division.row";
import {BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active/inactive are selected and ALL divisions
@DivisionGetter()
@OutputGetter([
    "career", "division",
    "hasBoutScheduled", "id",
    "last6", "name",
    "points", "record",
    "residence", "stance"
])
export class BoxrecPageRatingsActiveInactiveAllDivisionsRow extends BoxrecPageRatingsActiveInactiveDivisionRow
    implements DivisionInterface, OutputInterface {

    division: WeightDivision | null;
    output: BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput;

}
