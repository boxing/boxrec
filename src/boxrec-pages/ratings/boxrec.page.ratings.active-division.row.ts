import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveDivisionRowOutput} from "./boxrec.ratings.constants";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";

// ratings page where both active boxers are selected and specific division
@RatingGetter(true)
export class BoxrecPageRatingsActiveDivisionRow extends BoxrecPageRatingsRow implements RatingInterface {

    /**
     * Rating of the boxer between 0 and 100
     */
    rating: number | null;

    get age(): number {
        return parseInt(getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.age, false),
            10);
    }

    get output(): BoxrecPageRatingsActiveDivisionRowOutput {
        return {
            age: this.age,
            hasBoutScheduled: this.hasBoutScheduled,
            id: this.id,
            last6: this.last6,
            name: this.name,
            points: this.points,
            rating: this.rating,
            record: this.record,
            residence: this.residence,
            stance: this.stance,
        };
    }

}
