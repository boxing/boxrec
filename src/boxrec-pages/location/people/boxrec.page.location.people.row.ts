import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecLocation} from "../../boxrec.constants";
import {BoxrecPageLocationPeopleRowOutput} from "./boxrec.location.people.constants";

// todo include fighters and weight division/record etc.
export class BoxrecPageLocationPeopleRow {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 3)) as number;
    }

    /**
     * Some of the results may come back with just the `country`
     * ex. if you search USA, you'll get people "0 miles" from USA, and the region/town is excluded
     * @returns {BoxrecLocation}
     */
    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 2));
    }

    get miles(): number {
        return parseInt(getColumnData(this.$, 1, false), 10);
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnData(this.$, 3)) as string;
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
        return trimRemoveLineBreaks(getColumnData(this.$, 4, false)) as "male" | "female";
    }

}
