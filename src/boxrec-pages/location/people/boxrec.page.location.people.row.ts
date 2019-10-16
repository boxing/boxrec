import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../../helpers";
import {BoxrecLocation} from "../../boxrec.constants";
import {BoxrecPageLocationPeopleRowOutput} from "./boxrec.location.people.constants";
import {IdGetter, IdInterface} from "../../../decorators/id.decorator";

// todo include fighters and weight division/record etc.
@IdGetter()
export class BoxrecPageLocationPeopleRow implements IdInterface {

    id: number;

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    /**
     * Some of the results may come back with just the `country`
     * ex. if you search USA, you'll get people "0 miles" from USA, and the region/town is excluded
     * @returns {BoxrecLocation}
     */
    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location));
    }

    get miles(): number {
        return parseInt(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.miles, false), 10);
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name, false)) as string;
    }

    get output(): BoxrecPageLocationPeopleRowOutput {
        return {
            id: this.id,
            location: this.location,
            miles: this.miles,
            name: this.name,
            sex: this.sex,
        };
    }

    get sex(): "male" | "female" {
        return getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.sex, false) as "male" | "female";
    }

}
