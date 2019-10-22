import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {DayGetter, DayInterface} from "../../decorators/day.decorator";
import {IdGetter} from "../../decorators/id.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecLocation} from "../boxrec.constants";
import {BoxrecPageVenueEventsRowOutput} from "./boxrec.page.venue.constants";

@DateGetter()
@DayGetter()
@IdGetter(BoxrecCommonTableHeader.links)
export class BoxrecPageVenueEventsRow implements DateInterface, DayInterface {

    date: string;
    day: string;
    id: number | null;

    private readonly $: CheerioStatic;

    constructor(private headerColumns: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.location), 2);
    }

    get output(): BoxrecPageVenueEventsRowOutput {
        return {
            date: this.date,
            day: this.day,
            id: this.id,
            location: this.location,
        };
    }

}
