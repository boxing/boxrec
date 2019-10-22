import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsActiveDivisionRow} from "./boxrec.page.ratings.active-division.row";
import {BoxrecPageRatingsActiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// active boxers all divisions (P4P list)
// all division is the same as division specific except it has the division column
@DivisionGetter()
export class BoxrecPageRatingsActiveAllDivisionsRow extends BoxrecPageRatingsActiveDivisionRow
    implements DivisionInterface {

    division: WeightDivision | null;

    get output(): BoxrecPageRatingsActiveAllDivisionsRowOutput {
        return {
            age: this.age,
            division: this.division,
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
