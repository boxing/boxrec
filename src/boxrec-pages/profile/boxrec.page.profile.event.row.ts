import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecPageEventCommonRow} from "../location/event/boxrec.page.event.common.row";
import {BoxrecProfileEventLinks} from "./boxrec.profile.constants";

// used for profiles other than boxers
export class BoxrecPageProfileEventRow extends BoxrecPageEventCommonRow {

    get date(): string {
        return trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.date, false));
    }

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
