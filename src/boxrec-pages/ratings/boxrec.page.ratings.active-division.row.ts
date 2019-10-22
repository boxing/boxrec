import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveDivisionRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active boxers are selected and specific division
@OutputGetter([
    "age", "hasBoutScheduled", "id", "last6", "name", "points", "rating", "record", "residence", "stance"
])
@RatingGetter(true)
export class BoxrecPageRatingsActiveDivisionRow extends BoxrecPageRatingsRow
    implements OutputInterface, RatingInterface {

    output: BoxrecPageRatingsActiveDivisionRowOutput;
    /**
     * Rating of the boxer between 0 and 100
     */
    rating: number | null;

    get age(): number {
        return parseInt(getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.age, false),
            10);
    }

}
