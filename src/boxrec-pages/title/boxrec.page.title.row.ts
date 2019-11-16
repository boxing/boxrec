import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxerGetter, BoxerInterface} from "../../decorators/boxer.decorator";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {FirstBoxerWeightGetter, FirstBoxerWeightInterface} from "../../decorators/firstBoxerWeight.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {NumberOfRoundsGetter, NumberOfRoundsInterface} from "../../decorators/numberOfRounds.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {BoxrecProfileCommonRow} from "../profile/boxrec.profile.common.row";
import {BoxrecPageTitleRowOutput} from "./boxrec.page.title.constants";

@DateGetter()
@BoxerGetter()
@BoxerGetter("secondBoxer")
@FirstBoxerWeightGetter()
@MetadataGetter()
@NumberOfRoundsGetter()
@OutcomeGetter()
@OutputGetter([
    "date", "firstBoxer", "firstBoxerWeight", "links", "location", "metadata",
    "numberOfRounds", "outcome", "rating", "secondBoxer", "secondBoxerWeight",
])
@RatingGetter()
export class BoxrecPageTitleRow extends BoxrecProfileCommonRow
    implements DateInterface, BoxerInterface, FirstBoxerWeightInterface,
        MetadataInterface, NumberOfRoundsInterface, OutcomeInterface, OutputInterface,
        RatingInterface {

    date: string;
    firstBoxer: BoxrecBasic;
    firstBoxerWeight: number | null;
    metadata: string | null;
    // todo can we use parsing helper method?
    numberOfRounds: number[];
    outcome: WinLossDraw;
    output: BoxrecPageTitleRowOutput;
    rating: number | null;
    secondBoxer: BoxrecBasic;

    protected readonly $: CheerioStatic;

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location), 1);
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondFighterWeight, false));
    }

}
