import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {IdGetter, IdInterface} from "../../../decorators/id.decorator";
import {LocationGetter} from "../../../decorators/location.decorator";
import {OutputGetter, OutputInterface} from "../../../decorators/output.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../../helpers";
import {BoxrecLocation} from "../../boxrec.constants";
import {BoxrecPageLocationPeopleRowOutput} from "./boxrec.location.people.constants";

// todo include fighters and weight division/record etc.
@IdGetter()
@LocationGetter()
@OutputGetter(["id", "location", "miles", "name", "sex"])
export class BoxrecPageLocationPeopleRow implements IdInterface, OutputInterface {

    id: number;
    /**
     * Some of the results may come back with just the `country`
     * ex. if you search USA, you'll get people "0 miles" from USA, and the region/town is excluded
     * @returns {BoxrecLocation}
     */
    location: BoxrecLocation;
    output: BoxrecPageLocationPeopleRowOutput;

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get miles(): number {
        return parseInt(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.miles, false), 10);
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name, false)) as string;
    }

    get sex(): "male" | "female" {
        return getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.sex, false) as "male" | "female";
    }

}
