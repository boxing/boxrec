import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {BoxrecProfileCommonRow} from "../profile/boxrec.profile.common.row";
import {BoxrecPageTitleRowOutput} from "./boxrec.page.title.constants";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {FirstBoxerGetter, FirstBoxerInterface} from "../../decorators/firstBoxer.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";
import {RatingGetter, RatingInterface} from "../../decorators/rating.decorator";
import {NumberOfRoundsGetter, NumberOfRoundsInterface} from "../../decorators/numberOfRounds.decorator";

@DateGetter()
@FirstBoxerGetter()
@MetadataGetter()
@NumberOfRoundsGetter()
@RatingGetter()
export class BoxrecPageTitleRow extends BoxrecProfileCommonRow
    implements DateInterface, FirstBoxerInterface, MetadataInterface, NumberOfRoundsInterface, RatingInterface {

    date: string;
    firstBoxer: BoxrecBasic;
    metadata: string | null;
    // todo can we use parsing helper method?
    numberOfRounds: number[];
    rating: number | null;

    protected readonly $: CheerioStatic;

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstFighterWeight, false));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location), 1);
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.outcome, false));
    }

    get output(): BoxrecPageTitleRowOutput {
        return {
            date: this.date,
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
        return BoxrecCommonTablesColumnsClass.parseNameAndId(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.opponent));
    }

    get secondBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.secondFighterWeight, false));
    }

}
