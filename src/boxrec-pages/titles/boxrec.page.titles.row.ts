import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {FirstBoxerGetter, FirstBoxerInterface} from "../../decorators/firstBoxer.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {NumberOfRoundsGetter, NumberOfRoundsInterface} from "../../decorators/numberOfRounds.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageTitlesRowOutput} from "./boxrec.page.title.constants";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";

@DateGetter()
@DivisionGetter()
@FirstBoxerGetter()
@MetadataGetter()
@NumberOfRoundsGetter()
@OutcomeGetter()
@RatingGetter(true)
export class BoxrecPageTitlesRow implements DateInterface, DivisionInterface, FirstBoxerInterface, MetadataInterface,
    NumberOfRoundsInterface, OutcomeInterface, RatingInterface {

    date: string;
    division: WeightDivision | null;
    firstBoxer: BoxrecBasic;
    metadata: string | null;
    // todo can we use parsing helper method?
    numberOfRounds: number[];
    outcome: WinLossDraw;
    rating: number | null;

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], tableRowInnerHTML: string,
                metadataFollowingRowInnerHTML: string | null = null) {
        this.$ = cheerio.load(`<table><tr>${tableRowInnerHTML}</tr><tr>${metadataFollowingRowInnerHTML}</tr></table>`);
    }

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstFighterWeight, false));
    }

    get links(): BoxrecGeneralLinks {
        return BoxrecCommonLinks.parseLinkInformation<BoxrecGeneralLinks>(this.parseLinks(), {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.location), 1);
    }

    get output(): BoxrecPageTitlesRowOutput {
        return {
            date: this.date,
            division: this.division,
            firstBoxer: this.firstBoxer,
            firstBoxerWeight: this.firstBoxerWeight,
            links: this.links,
            location: this.location,
            metadata: this.metadata,
            numberOfRounds: this.numberOfRounds,
            outcome: this.outcome,
            rating: this.rating,
            secondBoxer: this.secondBoxer,
            secondBoxerWeight: this.secondBoxerWeight,
        };
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.opponent));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondFighterWeight, false));
    }

    protected parseLinks(): Cheerio {
        return this.$(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.links));
    }

}
