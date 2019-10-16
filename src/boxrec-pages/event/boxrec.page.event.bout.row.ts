import {BoxrecFighterRole} from "boxrec-requests/dist/boxrec-requests.constants";
import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {FirstBoxerGetter, FirstBoxerInterface} from "../../decorators/firstBoxer.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecEventBoutRowOutput, BoxrecEventLinks} from "./boxrec.event.constants";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";

@FirstBoxerGetter()
@MetadataGetter()
@RatingGetter()
export class BoxrecPageEventBoutRow implements FirstBoxerInterface, MetadataInterface, RatingInterface {

    firstBoxer: BoxrecBasic;
    metadata: string | null;
    rating: number | null;

    private readonly $: CheerioStatic;

    constructor(private headerColumns: string[], boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.division, false));
    }

    get firstBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstLast6));
    }

    // returns an object with keys that contain a class other than `primaryIcon`

    get firstBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.record));
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstFighterWeight, false));
    }

    // not the exact same as the other page links
    get links(): BoxrecEventLinks {
        const linksStr: string = getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.links);

        return BoxrecCommonLinks.parseLinkInformation<BoxrecEventLinks>(this.$(linksStr), {
            bio: null,
            bout: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.rounds));
    }

    get outcome(): WinLossDraw | null {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.outcome, false));
    }

    get outcomeByWayOf(): string | null {
        return BoxrecCommonTablesColumnsClass.parseOutcomeByWayOf(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.outcomeByWayOf));
    }

    get output(): BoxrecEventBoutRowOutput {
        return {
            division: this.division,
            firstBoxer: this.firstBoxer,
            firstBoxerLast6: this.firstBoxerLast6,
            firstBoxerRecord: this.firstBoxerRecord,
            firstBoxerWeight: this.firstBoxerWeight,
            links: this.links,
            metadata: this.metadata,
            numberOfRounds: this.numberOfRounds,
            outcome: this.outcome,
            outcomeByWayOf: this.outcomeByWayOf,
            rating: this.rating,
            secondBoxer: this.secondBoxer,
            secondBoxerLast6: this.secondBoxerLast6,
            secondBoxerRecord: this.secondBoxerRecord,
            secondBoxerWeight: this.secondBoxerWeight,
            sport: this.sport,
        };
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.opponent));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondLast6));
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondRecord));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondFighterWeight, false));
    }

    get sport(): BoxrecFighterRole {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.sport,
            false) as BoxrecFighterRole;
    }

}
