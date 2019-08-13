import {BoxrecPageLists} from "../../../boxrec-common-tables/boxrec-page-lists";
import {BoxrecPageLocationPeopleOutput} from "./boxrec.location.people.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

/**
 * parse a BoxRec Locate People results page
 * <pre>ex. http://boxrec.com/en/locations/people?l%5Brole%5D=boxer&l%5Bdivision%5D=&l%5Bcountry%5D=US&l%5Bregion%5D=&l%5Btown%5D=&l_go=</pre>
 */
export class BoxrecPageLocationPeople extends BoxrecPageLists {

    get people(): BoxrecPageLocationPeopleRow[] {
        return this.getTableData(BoxrecPageLocationPeopleRow);
    }

    get numberOfPeople(): number {
        return this.numberOfPages;
    }

    get output(): BoxrecPageLocationPeopleOutput {
        return {
            numberOfPages: this.numberOfPages,
            numberOfPeople: this.numberOfPeople,
            people: this.people,
        };
    }

}
