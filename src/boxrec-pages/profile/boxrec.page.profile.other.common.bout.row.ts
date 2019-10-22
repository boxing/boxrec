import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {FirstBoxerWeightGetter, FirstBoxerWeightInterface} from "../../decorators/firstBoxerWeight.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {OutcomeGetter, OutcomeInterface} from "../../decorators/outcome.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileCommonRow} from "./boxrec.profile.common.row";

@DateGetter()
@FirstBoxerWeightGetter()
@MetadataGetter()
@OutcomeGetter(BoxrecCommonTableHeader.result)
@RatingGetter(true)
export class BoxrecPageProfileOtherCommonBoutRow extends BoxrecProfileCommonRow
    implements DateInterface, FirstBoxerWeightInterface, MetadataInterface, OutcomeInterface, RatingInterface {

    date: string;
    // todo this seems busted, doesn't look like it exists for referee
    firstBoxerWeight: number | null;
    metadata: string | null;
    // todo tests?  have left this as `BoxrecCommonTableHeader.result` until looked into
    outcome: WinLossDraw;
    rating: number | null;

    // todo used on any profile?
    get firstBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstRating));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.location));
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.rounds, false));
    }

    get secondBoxer(): BoxrecBasic {
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.opponent));
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

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.secondFighterWeight, false));
    }

}
