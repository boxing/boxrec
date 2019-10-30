import {BoxrecPageLists} from "../../../boxrec-common-tables/boxrec-page-lists";
import { ListingsGetter, ListingsInterface } from "../../../decorators/listings.decorator";
import {OutputGetter, OutputInterface} from "../../../decorators/output.decorator";
import {BoxrecPageLocationPeopleOutput} from "./boxrec.location.people.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

/**
 * parse a BoxRec Locate People results page
 * <pre>ex. http://boxrec.com/en/locations/people?l%5Brole%5D=boxer&l%5Bdivision%5D=&l%5Bcountry%5D=US&l%5Bregion%5D=&l%5Btown%5D=&l_go=</pre>
 */
@ListingsGetter("people", BoxrecPageLocationPeopleRow, ".dataTable")
@OutputGetter(["numberOfPages", "numberOfPeople", "people"])
export class BoxrecPageLocationPeople extends BoxrecPageLists implements ListingsInterface, OutputInterface {

    output: BoxrecPageLocationPeopleOutput;
    people: BoxrecPageLocationPeopleRow[];

    get numberOfPeople(): number {
        return this.numberOfPages;
    }

}
