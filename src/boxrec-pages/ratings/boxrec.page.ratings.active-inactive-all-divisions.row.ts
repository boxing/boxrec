import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsActiveInactiveDivisionRow} from "./boxrec.page.ratings.active-inactive-division.row";
import {BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active/inactive are selected and ALL divisions
@DivisionGetter()
export class BoxrecPageRatingsActiveInactiveAllDivisionsRow extends BoxrecPageRatingsActiveInactiveDivisionRow
    implements DivisionInterface {

    division: WeightDivision | null;

    get output(): BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput {
        return {
            career: this.career,
            division: this.division,
            hasBoutScheduled: this.hasBoutScheduled,
            id: this.id,
            last6: this.last6,
            name: this.name,
            points: this.points,
            record: this.record,
            residence: this.residence,
            stance: this.stance,
        };
    }

}
