import {getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveInactiveDivisionRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active/inactive are selected and a specific division
export class BoxrecPageRatingsActiveInactiveDivisionRow extends BoxrecPageRatingsRow {

    get career(): number[] {
        const career: string = getColumnDataByColumnHeader(this.$, this.headerColumns, "career", false);

        return career.split("-").map(item => parseInt(item, 10));
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
