import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecRole} from "../search/boxrec.search.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

export class BoxrecPageProfileJudgeSupervisorBoutRow extends BoxrecCommonTablesClass {

    hasBoxerRatings: boolean = false;
    protected role: BoxrecRole = BoxrecRole.boxer;
    private _date: string;
    private _firstBoxerRating: string;
    private _links: string;
    private _location: string;
    private _secondBoxerRating: string;
    private _startColumn: number = 1;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);
        this.parseBout();
        this.parseMetadata();
    }

    get date(): string {
        return trimRemoveLineBreaks(this._date);
    }

    private getColumnData(returnHtml: boolean = false): string {
        this._startColumn++;
        return getColumnData($, this._startColumn, returnHtml);
    }

    private parseBout(): void {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        const numberOfColumns: number = $(`tr:nth-child(1) td`).length;

        this.hasBoxerRatings = numberOfColumns === 14;

        // whether the boxer ratings are showing or not, we'll deliver the correct data
        // set the start column, when calling `getColumnData`, bump the number up
        this._startColumn = 1;

        this._date = this.getColumnData();
        this._firstBoxerWeight = this.getColumnData();

        if (this.hasBoxerRatings) {
            this._firstBoxerRating = this.getColumnData(true);
        }

        // empty 4th/5th column, move the number ahead
        this._startColumn++;

        this._secondBoxer = this.getColumnData(true);
        this._secondBoxerWeight = this.getColumnData();

        if (this.hasBoxerRatings) {
            this._secondBoxerRating = this.getColumnData(true);
        }

        this._secondBoxerRecord = this.getColumnData(true);
        this._secondBoxerLast6 = this.getColumnData(true);
        this._location = this.getColumnData();
        this._outcome = this.getColumnData();
        this._outcomeByWayOf = this.getColumnData(true);
        this._numberOfRounds = this.getColumnData();
        this._rating = this.getColumnData(true);
        this._links = this.getColumnData(true);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}
