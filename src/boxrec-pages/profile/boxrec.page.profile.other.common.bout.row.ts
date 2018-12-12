import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {getColumnData, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, Location, Record, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileBoxerBoutLinks} from "./boxrec.profile.constants";

export class BoxrecPageProfileOtherCommonBoutRow {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get date(): string {
        return trimRemoveLineBreaks(getColumnData(this.$, 2, false));
    }

    get firstBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 4));
        }

        return [];
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 2, false));
    }

    // todo this seems backwards but the previous code had it the same way.  Need to investigate
    get hasBoxerRatings(): boolean {
        return !this.hasMoreColumns;
    }

    // todo does this work, what is it?
    get links(): string {
        const html: Cheerio = this.$(getColumnData(this.$, 14));
        const obj: BoxrecProfileBoxerBoutLinks = {
            bio_open: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = this.$(elem).find("div");
            const href: string = this.$(elem).attr("href");
            const classAttr: string = div.attr("class");
            const hrefArr: string[] = classAttr.split(" ");

            hrefArr.forEach(cls => {
                if (cls !== "primaryIcon" && cls !== "clickableIcon") {
                    const matches: RegExpMatchArray | null = href.match(/(\d+)$/);
                    if (matches && matches[1] && matches[1] !== "other") {

                        let formattedCls: string = cls;
                        // for some reason they add a `P` to the end of the class name, we will remove it
                        if (cls.slice(-1) === "P") {
                            formattedCls = cls.slice(0, -1);
                        }

                        (obj as any)[formattedCls] = parseInt(matches[1], 10);
                    } else {
                        (obj as any).other.push(href);
                    }
                }
            });
        });

        return obj;

    }

    get location(): Location {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnData(this.$, 11));
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnData(this.$, 13, false));
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnData(this.$, 12, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnData(this.$, 14, false));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnData(this.$, 6));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnData(this.$, 10));
    }

    get secondBoxerRating(): Array<number | null> {
        if (this.hasMoreColumns) {
            BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnData(this.$, 8));
        }

        return [];
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnData(this.$, 9));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnData(this.$, 7, false));
    }

    private get hasMoreColumns(): boolean {
        // if the boxer ratings is showing, the number of columns changes from 14 to 16
        return this.$(`tr:nth-child(1) td`).length === 16;
    }

}
