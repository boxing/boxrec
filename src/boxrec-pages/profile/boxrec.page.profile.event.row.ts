import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {LocationGetter} from "../../decorators/location.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecPageEventCommonRow} from "../location/event/boxrec.page.event.common.row";
import {BoxrecProfileEventLinks} from "./boxrec.profile.constants";

// used for profiles other than boxers
@DateGetter()
@LocationGetter()
@MetadataGetter()
export class BoxrecPageProfileEventRow extends BoxrecPageEventCommonRow implements DateInterface, MetadataInterface {

    date: string;
    location: BoxrecLocation;
    metadata: string | null;

    get links(): BoxrecProfileEventLinks {
        const linksStr: string = `<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.links)}</div>`;

        return BoxrecCommonLinks.parseLinkInformation<BoxrecProfileEventLinks>(this.$(linksStr), {
            event: null,
        });
    }

}
