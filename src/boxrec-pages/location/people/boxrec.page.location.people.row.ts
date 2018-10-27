import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../../helpers";
import {Location, Record} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageLocationPeopleRow {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyBout: string) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    // todo should only be for boxers
    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnData(this.$, 7));
    }

    // todo should only be for boxers
    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 6, false));
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 3)) as number;
    }

    /**
     * Some of the results may come back with just the `country`
     * ex. if you search USA, you'll get people "0 miles" from USA, and the region/town is excluded
     * @returns {Location}
     */
    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 2));
    }

    get miles(): number {
        return parseInt(getColumnData(this.$, 1, false), 10);
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnData(this.$, 3)) as string;
    }

    // todo should only be for boxers
    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 5));
    }

    get sex(): "male" | "female" {
        return trimRemoveLineBreaks(getColumnData(this.$, 4, false)) as "male" | "female";
    }

}
