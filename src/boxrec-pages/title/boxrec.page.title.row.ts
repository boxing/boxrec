import {BoxerGetter, BoxerInterface} from "../../decorators/boxer.decorator";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {LocationGetter} from "../../decorators/location.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {NumberOfRoundsGetter, NumberOfRoundsInterface} from "../../decorators/numberOfRounds.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxerWeightInterface, WeightGetter} from "../../decorators/weight.decorator";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {BoxrecProfileCommonRow} from "../profile/boxrec.profile.common.row";
import {BoxrecPageTitleRowOutput} from "./boxrec.page.title.constants";

@DateGetter()
@BoxerGetter()
@BoxerGetter("secondBoxer")
@WeightGetter()
@LocationGetter(1)
@MetadataGetter()
@NumberOfRoundsGetter()
@OutcomeGetter()
@OutputGetter([
    "date", "firstBoxer", "firstBoxerWeight", "links", "location", "metadata",
    "numberOfRounds", "outcome", "rating", "secondBoxer", "secondBoxerWeight",
])
@RatingGetter()
@WeightGetter("secondBoxerWeight")
export class BoxrecPageTitleRow extends BoxrecProfileCommonRow
    implements DateInterface, BoxerInterface, BoxerWeightInterface,
        MetadataInterface, NumberOfRoundsInterface, OutcomeInterface, OutputInterface,
        RatingInterface {

    date: string;
    firstBoxer: BoxrecBasic;
    firstBoxerWeight: number | null;
    location: BoxrecLocation;
    metadata: string | null;
    // todo can we use parsing helper method?
    numberOfRounds: number[];
    outcome: WinLossDraw;
    output: BoxrecPageTitleRowOutput;
    rating: number | null;
    secondBoxer: BoxrecBasic;
    secondBoxerWeight: number | null;

    protected readonly $: CheerioStatic;

}
