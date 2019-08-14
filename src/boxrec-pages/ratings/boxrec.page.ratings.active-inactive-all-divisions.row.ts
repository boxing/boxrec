import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData} from "../../helpers";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatingsActiveInactiveDivisionRow} from "./boxrec.page.ratings.active-inactive-division.row";
import {BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active/inactive are selected and ALL divisions
export class BoxrecPageRatingsActiveInactiveAllDivisionsRow extends BoxrecPageRatingsActiveInactiveDivisionRow {

    get division(): WeightDivision | null {
        const t: any = getColumnData(this.$,
            this.getColumnByType("division"), false);

        return BoxrecCommonTablesColumnsClass.parseDivision(t);
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
