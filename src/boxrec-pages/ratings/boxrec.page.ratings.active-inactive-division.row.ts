import {BoxrecPageRatingsHelpersRow} from "./boxrec.page.ratings.helpers.row";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveInactiveDivisionRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active/inactive are selected and a specific division
export class BoxrecPageRatingsActiveInactiveDivisionRow extends BoxrecPageRatingsRow {

    get career(): number[] {
        return BoxrecPageRatingsHelpersRow.getCareer(this.$, this.getColumnByType("career"));
    }

    get output(): BoxrecPageRatingsActiveInactiveDivisionRowOutput {
        return {
            career: this.career,
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
