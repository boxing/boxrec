import {BoxrecPageLists} from '../../../boxrec-common-tables/boxrec-page-lists';
import { ListingsGetter } from '../../../decorators/listings.decorator';
import { ListingsInterface } from '../../../decorators/listings.decorator';
import {OutputGetter, OutputInterface} from '../../../decorators/output.decorator';
import {BoxrecPageVenueEventsRowOutput} from '../../venue/boxrec.page.venue.constants';
import {BoxrecPageLocationEventOutput} from './boxrec.location.event.constants';
import {BoxrecPageLocationEventRow} from './boxrec.page.location.event.row';

/**
 * parse a BoxRec Locate Events results page
 * <pre>ex. http://boxrec.com/en/locations/event?l%5Bcountry%5D=US&l%5Bregion%5D=CO&l%5Btown%5D=&l%5Bvenue%5D=&l%5Byear%5D=2017&l_go=</pre>
 */
@ListingsGetter('events', BoxrecPageLocationEventRow, '.dataTable')
@OutputGetter([{
    function: (events: BoxrecPageVenueEventsRowOutput[]) => events.map((event: any) => event.output),
    method: 'events',
}, 'numberOfLocations'])
export class BoxrecPageLocationEvent extends BoxrecPageLists implements ListingsInterface, OutputInterface {

    events: BoxrecPageLocationEventRow[];
    output: BoxrecPageLocationEventOutput;

    get numberOfLocations(): number {
        return this.numberOfPages;
    }

}
