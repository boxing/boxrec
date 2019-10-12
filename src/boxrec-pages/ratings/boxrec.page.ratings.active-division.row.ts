import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveDivisionRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active boxers are selected and specific division
export class BoxrecPageRatingsActiveDivisionRow extends BoxrecPageRatingsRow {

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

    /**
     * Rating of the boxer between 0 and 100
     */
    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.rating));
    }

}
