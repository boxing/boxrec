import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecLocation} from "../../boxrec.constants";
import {BoxrecPageLocationEventRowOutput} from "./boxrec.location.event.constants";
import {BoxrecPageEventCommonRow} from "./boxrec.page.event.common.row";

export class BoxrecPageLocationEventRow extends BoxrecPageEventCommonRow {

    get date(): string {
        return trimRemoveLineBreaks(this.getColumnData(2, false));
    }

    get day(): string {
        return this.getColumnData(3, false);
    }

    get id(): number | null {
        return BoxrecCommonTablesColumnsClass.parseId(this.getColumnData(6));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(this.getColumnData(5), 2);
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

    protected getVenueColumnData(): Cheerio {
        return this.$(`<div>${this.getColumnData(4)}</div>`);
    }

    // unused here but used in parent class
    protected hasMoreColumns(): boolean {
        return this.$(`tr:nth-child(1) td`).length === 7;
    }

}
