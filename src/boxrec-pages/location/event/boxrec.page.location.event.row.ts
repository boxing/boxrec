import {BoxrecCommonTablesColumnsClass} from '../../../boxrec-common-tables/boxrec-common-tables-columns.class';
import {DateGetter, DateInterface} from '../../../decorators/date.decorator';
import {DayGetter, DayInterface} from '../../../decorators/day.decorator';
import {IdGetter} from '../../../decorators/id.decorator';
import {OutputGetter, OutputInterface} from '../../../decorators/output.decorator';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../../../helpers';
import {BoxrecLocation} from '../../boxrec.constants';
import {BoxrecPageLocationEventRowOutput} from './boxrec.location.event.constants';
import {BoxrecPageEventCommonRow} from './boxrec.page.event.common.row';

@DateGetter()
@DayGetter()
@IdGetter(BoxrecCommonTableHeader.links)
@OutputGetter(['date', 'day', 'id', 'location', 'venue'])
export class BoxrecPageLocationEventRow extends BoxrecPageEventCommonRow implements DateInterface, DayInterface,
    OutputInterface {

    date: string;
    day: string;
    id: number | null;
    output: BoxrecPageLocationEventRowOutput;

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location), 2);
    }

}
