import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxerGetter} from "../../decorators/boxer.decorator";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {LocationGetter} from "../../decorators/location.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxerWeightInterface, WeightGetter} from "../../decorators/weight.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {Record, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileCommonRow} from "./boxrec.profile.common.row";

@BoxerGetter("secondBoxer")
@DateGetter()
@WeightGetter()
@LocationGetter()
@MetadataGetter()
@OutcomeGetter(BoxrecCommonTableHeader.result)
@RatingGetter()
@WeightGetter("secondBoxerWeight")
export class BoxrecPageProfileOtherCommonBoutRow extends BoxrecProfileCommonRow
    implements DateInterface, BoxerWeightInterface, MetadataInterface, OutcomeInterface, RatingInterface {

    date: string;
    // todo this seems busted, doesn't look like it exists for referee
    firstBoxerWeight: number | null;
    metadata: string | null;
    // todo tests?  have left this as `BoxrecCommonTableHeader.result` until looked into
    outcome: WinLossDraw;
    rating: number | null;
    secondBoxerWeight: number | null;

    // todo used on any profile?
    get firstBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstRating));
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.rounds, false));
    }

    // todo does not exist for referee
    get secondBoxerLast6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondLast6));
    }

    // todo used on any profile?
    get secondBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondRating));
    }

    // todo does not exist for referee
    get secondBoxerRecord(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondRecord));
    }

}
