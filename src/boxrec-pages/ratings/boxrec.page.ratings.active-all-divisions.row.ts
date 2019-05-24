import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecPageRatingsActiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";
import {BoxrecPageRatingsHelpersRow} from "./boxrec.page.ratings.helpers.row";

// active boxers all divisions (P4P list)
export class BoxrecPageRatingsActiveAllDivisionsRow extends BoxrecPageRatingsRow {

    protected readonly columns: string[] = [
        "id",
        "name",
        "points",
        "rating",
        "division",
        "age",
        "record",
        "stance",
        "residence",
    ];

    get age(): number {
        return BoxrecPageRatingsHelpersRow.getAge(this.$, this.getColumnByType("age"));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$,
            this.getColumnByType("division"), false));
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

    /**
     * Rating of the boxer between 0 and 100
     *
     */
    get rating(): number | null {
        return BoxrecPageRatingsHelpersRow.getRating(this.$, this.getColumnByType("rating"));
    }

}
