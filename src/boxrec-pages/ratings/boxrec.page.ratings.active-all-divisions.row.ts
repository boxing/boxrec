import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnDataByColumnHeader} from "../../helpers";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsActiveDivisionRow} from "./boxrec.page.ratings.active-division.row";
import {BoxrecPageRatingsActiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// active boxers all divisions (P4P list)
// all division is the same as division specific except it has the division column
export class BoxrecPageRatingsActiveAllDivisionsRow extends BoxrecPageRatingsActiveDivisionRow {

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnDataByColumnHeader(this.$, this.headerColumns,
            "division", false));
    }

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
