import {BoxrecCommonTablesColumnsClass} from '../../../boxrec-common-tables/boxrec-common-tables-columns.class';
import {DivisionGetter, DivisionInterface} from '../../../decorators/division.decorator';
import {OutputGetter, OutputInterface} from '../../../decorators/output.decorator';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../../../helpers';
import {Record, WinLossDraw} from '../../boxrec.constants';
import {WeightDivision} from '../../champions/boxrec.champions.constants';
import {BoxrecPageLocationBoxerRowOutput} from './boxrec.location.people.constants';
import {BoxrecPageLocationPeopleRow} from './boxrec.page.location.people.row';

// at this time this does not support searching for "all fighters"
// todo this is not BoxerRow anymore but fighters
// todo does this work for all fighter roles?
@DivisionGetter()
@OutputGetter(['career', 'division', 'id', 'last6', 'location', 'miles', 'name', 'record', 'sex'])
export class BoxrecPageLocationBoxerRow extends BoxrecPageLocationPeopleRow
    implements DivisionInterface, OutputInterface {

    division: WeightDivision | null;
    output: BoxrecPageLocationBoxerRowOutput;

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.career));
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstLast6));
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.record));
    }

}
