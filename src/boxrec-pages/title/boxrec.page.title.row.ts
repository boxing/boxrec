import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, Location} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageTitleRow extends BoxrecCommonTablesClass {

    private _date: string;
    private _firstBoxer: string;
    private _links: string;
    private _location: string;

    constructor(tableRowInnerHTML: string, metadataFollowingRowInnerHTML: string | null = null) {
        super();
        const html: string = `<table><tr>${tableRowInnerHTML}</tr><tr>${metadataFollowingRowInnerHTML}</tr></table>`;
        $ = cheerio.load(html);

        this.parse();
        this.parseMetadata();
    }

    get date(): string {
        return trimRemoveLineBreaks(this._date);
    }

    get firstBoxer(): BoxrecBasic {
        return BoxrecCommonTablesClass.parseNameAndId(this._firstBoxer);
    }

    get location(): Location {
        return BoxrecCommonTablesClass.parseLocationLink(this._location, 1);
    }

    get numberOfRounds(): number[] {
        const numberOfRounds: string = trimRemoveLineBreaks(this._numberOfRounds);
        if (numberOfRounds.includes("/")) {
            // ended early
            return numberOfRounds.split("/").map(item => parseInt(item, 10));
        }

        const parsedNumberOfRounds: number = parseInt(numberOfRounds, 10);
        // went to decision
        return [parsedNumberOfRounds, parsedNumberOfRounds];
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesClass.parseNameAndId(this._secondBoxer);
    }

    private parse(): void {
        this._date = getColumnData($, 1, false);
        this._firstBoxer = getColumnData($, 2);
        this._firstBoxerWeight = getColumnData($, 3, false);
        this._outcome = getColumnData($, 4, false);
        this._secondBoxer = getColumnData($, 5);
        this._secondBoxerWeight = getColumnData($, 6, false);
        this._location = getColumnData($, 7);
        this._outcomeByWayOf = getColumnData($, 8, false);
        this._numberOfRounds = getColumnData($, 9, false);
        this._rating = getColumnData($, 10);
        this._links = getColumnData($, 11);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}