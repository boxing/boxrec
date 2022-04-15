import {BoutsGetter, BoutsInterface} from '../../decorators/bouts.decorator';
import {OutputGetter, OutputInterface} from '../../decorators/output.decorator';
import {BoxrecPageProfile} from './boxrec.page.profile';
import {BoxrecProfileOtherOutput} from './boxrec.page.profile.constants';
import {BoxrecPageProfileOtherCommonBoutRow} from './boxrec.page.profile.other.common.bout.row';

/**
 * BoxRec Judge/Supervisor Profile Page
 * <pre>ex. http://boxrec.com/en/judge/401002</pre>
 * <pre>ex. http://boxrec.com/en/supervisor/406714</pre>
 */
@BoutsGetter('table', BoxrecPageProfileOtherCommonBoutRow)
@OutputGetter(['birthName', 'birthPlace', 'bouts', 'globalId', 'name', 'otherInfo', 'picture',
    'residence', 'role', 'status',
])
export class BoxrecPageProfileOtherCommon extends BoxrecPageProfile implements BoutsInterface, OutputInterface {

    /**
     * Returns the bouts information for the judge/supervisor
     * is order from most recent to oldest
     * the number of columns is different of a boxer
     * @returns {BoxrecPageProfileOtherCommonBoutRow[]}
     */
    bouts: BoxrecPageProfileOtherCommonBoutRow[];
    output: BoxrecProfileOtherOutput;

}
