import {OutputGetter, OutputInterface} from '../../decorators/output.decorator';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../../helpers';
import {BoxrecPageRatingsRow} from './boxrec.page.ratings.row';
import {BoxrecPageRatingsActiveInactiveDivisionRowOutput} from './boxrec.ratings.constants';

// ratings page where both active/inactive are selected and a specific division
@OutputGetter(['career', 'hasBoutScheduled', 'id', 'last6', 'name', 'points', 'record', 'residence', 'stance'])
export class BoxrecPageRatingsActiveInactiveDivisionRow extends BoxrecPageRatingsRow
    implements OutputInterface {

    output: BoxrecPageRatingsActiveInactiveDivisionRowOutput;

    get career(): number[] {
        const career: string = getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.career,
            false);

        return career.split('-').map(item => parseInt(item, 10));
    }

}
