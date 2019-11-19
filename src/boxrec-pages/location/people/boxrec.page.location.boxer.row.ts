import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {DivisionGetter, DivisionInterface} from "../../../decorators/division.decorator";
import {Last6Getter, Last6Interface} from "../../../decorators/last6.decorator";
import {OutputGetter, OutputInterface} from "../../../decorators/output.decorator";
import {RecordGetter, RecordInterface} from "../../../decorators/record.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../../helpers";
import {Record, WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxrecPageLocationBoxerRowOutput} from "./boxrec.location.people.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

// at this time this does not support searching for "all fighters"
// todo this is not BoxerRow anymore but fighters
// todo does this work for all fighter roles?
@DivisionGetter()
@Last6Getter()
@OutputGetter(["career", "division", "id", "last6", "location", "miles", "name", "record", "sex"])
@RecordGetter()
export class BoxrecPageLocationBoxerRow extends BoxrecPageLocationPeopleRow
    implements DivisionInterface, Last6Interface, OutputInterface, RecordInterface {

    division: WeightDivision | null;
    last6: WinLossDraw[];
    output: BoxrecPageLocationBoxerRowOutput;
    record: Record;

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.career));
    }

}
