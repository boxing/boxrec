import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../../helpers";
import {Record, WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxrecPageLocationBoxerRowOutput} from "./boxrec.location.people.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

// at this time this does not support searching for "all fighters"
// todo this is not BoxerRow anymore but fighters
// todo does this work for all fighter roles?
export class BoxrecPageLocationBoxerRow extends BoxrecPageLocationPeopleRow {

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.career));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.division, false));
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstLast6));
    }

    get output(): BoxrecPageLocationBoxerRowOutput {
        return {
            career: this.career,
            division: this.division,
            id: this.id,
            last6: this.last6,
            location: this.location,
            miles: this.miles,
            name: this.name,
            record: this.record,
            sex: this.sex,
        };
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.record));
    }

}
