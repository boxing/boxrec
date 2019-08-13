import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData} from "../../helpers";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsHelpersRow} from "./boxrec.page.ratings.helpers.row";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active/inactive are selected and ALL divisions
export class BoxrecPageRatingsActiveInactiveAllDivisionsRow extends BoxrecPageRatingsRow {

    protected readonly columns: string[] = [
        "id",
        "name",
        "points",
        "record",
        "division",
        "career",
        "last 6",
        "stance",
        "residence",
    ];

    get career(): number[] {
        return BoxrecPageRatingsHelpersRow.getCareer(this.$, this.getColumnByType("career"));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$,
            this.getColumnByType("division"), false));
    }

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
