import {BoxrecFighterRole} from "boxrec-requests/dist/boxrec-requests.constants";
import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxerGetter, BoxerInterface} from "../../decorators/boxer.decorator";
import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxerWeightInterface, WeightGetter} from "../../decorators/weight.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, Record, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecEventBoutRowOutput, BoxrecEventLinks} from "./boxrec.event.constants";

@BoxerGetter()
@BoxerGetter("secondBoxer")
@DivisionGetter()
@MetadataGetter()
@OutcomeGetter()
@OutputGetter([
    "division", "firstBoxer", "firstBoxerLast6", "firstBoxerRecord",
    "firstBoxerWeight", "links", "metadata", "numberOfRounds",
    "outcome", "outcomeByWayOf", "rating", "secondBoxer",
    "secondBoxerLast6", "secondBoxerRecord", "secondBoxerWeight", "sport"
])
@RatingGetter()
@WeightGetter()
@WeightGetter("secondBoxerWeight")
export class BoxrecPageEventBoutRow
    implements DivisionInterface,
        BoxerInterface, BoxerWeightInterface,
        MetadataInterface, OutcomeInterface, OutputInterface, RatingInterface {

    division: WeightDivision | null;
    firstBoxer: BoxrecBasic;
    firstBoxerWeight: number | null;
    metadata: string | null;
    outcome: WinLossDraw | null;
    output: BoxrecEventBoutRowOutput;
    rating: number | null;
    secondBoxer: BoxrecBasic;
    secondBoxerWeight: number | null;

    private readonly $: CheerioStatic;

    constructor(private headerColumns: string[], boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
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

    get outcomeByWayOf(): string | null {
        return BoxrecCommonTablesColumnsClass.parseOutcomeByWayOf(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.outcomeByWayOf));
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondLast6));
    }

    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondRecord));
    }

    // todo the value returned does not match the typedef
    get sport(): BoxrecFighterRole {
        return getColumnDataByColumnHeader(this.$, this.headerColumns, BoxrecCommonTableHeader.sport,
            false) as BoxrecFighterRole;
    }

}
