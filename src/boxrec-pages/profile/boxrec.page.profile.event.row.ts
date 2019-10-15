import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecPageEventCommonRow} from "../location/event/boxrec.page.event.common.row";
import {BoxrecProfileEventLinks} from "./boxrec.profile.constants";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";

// used for profiles other than boxers
@DateGetter()
export class BoxrecPageProfileEventRow extends BoxrecPageEventCommonRow implements DateInterface {

    date: string;

    get links(): BoxrecProfileEventLinks {
        const linksStr: string = `<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.links)}</div>`;

        return BoxrecCommonLinks.parseLinkInformation<BoxrecProfileEventLinks>(this.$(linksStr), {
            event: null,
        });
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

}
