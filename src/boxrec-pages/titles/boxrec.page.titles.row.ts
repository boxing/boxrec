import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxerGetter, BoxerInterface} from "../../decorators/boxer.decorator";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {DivisionGetter, DivisionInterface} from "../../decorators/division.decorator";
import {LocationGetter} from "../../decorators/location.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {NumberOfRoundsGetter, NumberOfRoundsInterface} from "../../decorators/numberOfRounds.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxerWeightInterface, WeightGetter} from "../../decorators/weight.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageTitlesRowOutput} from "./boxrec.page.title.constants";

@BoxerGetter()
@BoxerGetter("secondBoxer")
@DateGetter()
@DivisionGetter()
@LocationGetter(1)
@MetadataGetter()
@NumberOfRoundsGetter()
@OutcomeGetter()
@OutputGetter(["date", "division", "firstBoxer", "firstBoxerWeight", "links",
    "location", "metadata", "numberOfRounds", "outcome", "rating", "secondBoxer", "secondBoxerWeight",
])
@RatingGetter()
@WeightGetter()
@WeightGetter("secondBoxerWeight")
export class BoxrecPageTitlesRow implements DateInterface, DivisionInterface, BoxerInterface,
    BoxerWeightInterface, MetadataInterface,
    NumberOfRoundsInterface, OutcomeInterface, OutputInterface, RatingInterface {

    date: string;
    division: WeightDivision | null;
    firstBoxer: BoxrecBasic;
    firstBoxerWeight: number | null;
    location: BoxrecLocation;
    metadata: string | null;
    // todo can we use parsing helper method?
    numberOfRounds: number[];
    outcome: WinLossDraw;
    output: BoxrecPageTitlesRowOutput;
    rating: number | null;
    secondBoxerWeight: number | null;

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], tableRowInnerHTML: string,
                metadataFollowingRowInnerHTML: string | null = null) {
        this.$ = cheerio.load(`<table><tr>${tableRowInnerHTML}</tr><tr>${metadataFollowingRowInnerHTML}</tr></table>`);
    }

    get links(): BoxrecGeneralLinks {
        return BoxrecCommonLinks.parseLinkInformation<BoxrecGeneralLinks>(this.parseLinks(), {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

    protected parseLinks(): Cheerio {
        return this.$(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.links));
    }

}
