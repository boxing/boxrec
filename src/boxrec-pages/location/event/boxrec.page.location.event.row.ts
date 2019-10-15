import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../../helpers";
import {BoxrecLocation} from "../../boxrec.constants";
import {BoxrecPageLocationEventRowOutput} from "./boxrec.location.event.constants";
import {BoxrecPageEventCommonRow} from "./boxrec.page.event.common.row";
import {DateGetter, DateInterface} from "../../../decorators/date.decorator";

@DateGetter()
export class BoxrecPageLocationEventRow extends BoxrecPageEventCommonRow implements DateInterface {

    date: string;

    get day(): string {
        return getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.day, false);
    }

    get id(): number | null {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.links));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location), 2);
    }

    get output(): BoxrecPageLocationEventRowOutput {
        return {
            date: this.date,
            day: this.day,
            id: this.id,
            location: this.location,
            venue: this.venue,
        };
    }

}
