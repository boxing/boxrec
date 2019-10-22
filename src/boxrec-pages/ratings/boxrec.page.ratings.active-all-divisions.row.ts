import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsActiveDivisionRow} from "./boxrec.page.ratings.active-division.row";
import {BoxrecPageRatingsActiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// active boxers all divisions (P4P list)
// all division is the same as division specific except it has the division column
@DivisionGetter()
@OutputGetter([
    "age", "division", "hasBoutScheduled", "id", "last6", "name", "points", "rating", "record", "residence", "stance",
])
export class BoxrecPageRatingsActiveAllDivisionsRow extends BoxrecPageRatingsActiveDivisionRow
    implements DivisionInterface, OutputInterface {

    division: WeightDivision | null;
    output: BoxrecPageRatingsActiveAllDivisionsRowOutput;

}
