import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData} from "../../../helpers";
import {Record} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxrecPageLocationBoxerRowOutput} from "./boxrec.location.people.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

export class BoxrecPageLocationBoxerRow extends BoxrecPageLocationPeopleRow {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyBout: string) {
        super(boxrecBodyBout);
        const html: string = `<table><tr>${boxrecBodyBout}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnData(this.$, 7));
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 6, false));
    }

    get output(): BoxrecPageLocationBoxerRowOutput {
        return {
            career: this.career,
            division: this.division,
            id: this.id,
            location: this.location,
            miles: this.miles,
            name: this.name,
            record: this.record,
            sex: this.sex,
        };
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 5));
    }

}
