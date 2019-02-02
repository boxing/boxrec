import {BoxrecPageLists} from "../../../boxrec-common-tables/boxrec-page-lists";
import {BoxrecPageLocationEventRow} from "./boxrec.page.location.event.row";

/**
 * parse a BoxRec Locate Events results page
 * <pre>ex. http://boxrec.com/en/locations/event?l%5Bcountry%5D=US&l%5Bregion%5D=CO&l%5Btown%5D=&l%5Bvenue%5D=&l%5Byear%5D=2017&l_go=</pre>
 */
export class BoxrecPageLocationEvent extends BoxrecPageLists {

    protected readonly $: CheerioStatic;

    get events(): BoxrecPageLocationEventRow[] {
        return this.getTableData(BoxrecPageLocationEventRow);
    }

    get numberOfLocations(): number {
        return this.getNumberOfPages();
    }

}
