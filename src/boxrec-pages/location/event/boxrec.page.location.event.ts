import {BoxrecPageLists} from "../../../boxrec-common-tables/boxrec-page-lists";
import {OutputGetter, OutputInterface} from "../../../decorators/output.decorator";
import {BoxrecPageVenueEventsRowOutput} from "../../venue/boxrec.page.venue.constants";
import {BoxrecPageLocationEventOutput} from "./boxrec.location.event.constants";
import {BoxrecPageLocationEventRow} from "./boxrec.page.location.event.row";

/**
 * parse a BoxRec Locate Events results page
 * <pre>ex. http://boxrec.com/en/locations/event?l%5Bcountry%5D=US&l%5Bregion%5D=CO&l%5Btown%5D=&l%5Bvenue%5D=&l%5Byear%5D=2017&l_go=</pre>
 */
@OutputGetter([{
    function: (events: BoxrecPageVenueEventsRowOutput[]) => events.map((event: any) => event.output),
    method: "events",
}, "numberOfLocations"])
export class BoxrecPageLocationEvent extends BoxrecPageLists implements OutputInterface {

    output: BoxrecPageLocationEventOutput;

    get events(): BoxrecPageLocationEventRow[] {
        return this.getTableData(BoxrecPageLocationEventRow);
    }

    get numberOfLocations(): number {
        return this.numberOfPages;
    }

}
