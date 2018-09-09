import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesColumnsClass} from "../boxrec-common-tables/boxrec-common-tables-columns.class";
import {Location, Record, Stance, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";

const cheerio: CheerioAPI = require("cheerio");

export class BoxrecPageRatingsRow {

    private $: CheerioStatic;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get age(): number | null {
        const age: string = this.getColumnData(5, false);
        if (age) {
            return parseInt(age, 10);
        }

        return null;
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnData(this.$, 5, false));
    }

    get hasBoutScheduled(): boolean | null {
        const idName: string = getColumnData(this.$, 2);
        if (idName) {
            const html: Cheerio = this.$(`<div>${idName}</div>`);
            let name: string = html.text();
            name = name.trim();
            return name.slice(-1) === "*";
        }

        return null;
    }

    get id(): number {
        return BoxrecCommonTablesColumnsClass.parseId(getColumnData(this.$, 2)) as number;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(this.getColumnData(6));
    }

    get name(): string {
        return BoxrecCommonTablesColumnsClass.parseName(getColumnData(this.$, 2));
    }

    get points(): number | null {
        const points: number = parseInt(getColumnData(this.$, 3, false), 10);

        if (!isNaN(points)) {
            return points;
        }

        return null;
    }

    get ranking(): number | null {
        const ranking: string = getColumnData(this.$, 4);
        if (ranking) {
            return parseInt(ranking, 10);
        }

        return null;
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 4));
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(this.getColumnData(6));
    }

    get residence(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(this.getColumnData(8));
    }

    get stance(): Stance | null {
        const stance: string = this.getColumnData(7, false);
        if (stance) {
            return trimRemoveLineBreaks(stance) as Stance;
        }

        return null;
    }

    private getColumnData(colNum: number, returnHTML: boolean = true): string {
        let columnNumber: number = colNum;
        if (this.hasMoreColumns()) {
            columnNumber++;
        }
        return getColumnData(this.$, columnNumber, returnHTML);
    }

    private hasMoreColumns(): boolean {
        // on pages where it's about a specific weight class, the division column is omitted
        return this.$(`tr:nth-child(1) td`).length === 9;
    }

}
