import { ListingsGetter, ListingsInterface } from '../../../decorators/listings.decorator';
import {BoxrecPageLocationBoxerRow} from './boxrec.page.location.boxer.row';
import {BoxrecPageLocationPeople} from './boxrec.page.location.people';

/**
 * parse a BoxRec Locate People results page (for boxers)
 * <pre>ex. http://boxrec.com/en/locations/people?l%5Brole%5D=boxer&l%5Bdivision%5D=&l%5Bcountry%5D=US&l%5Bregion%5D=&l%5Btown%5D=&l_go=</pre>
 */
@ListingsGetter('people', BoxrecPageLocationBoxerRow, '.dataTable')
export class BoxrecPageLocationBoxer extends BoxrecPageLocationPeople implements ListingsInterface {

    people: BoxrecPageLocationBoxerRow[];

}
