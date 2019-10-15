import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, WinLossDraw} from "../boxrec.constants";
import {BoxrecProfileCommonRow} from "../profile/boxrec.profile.common.row";
import {BoxrecPageTitleRowOutput} from "./boxrec.page.title.constants";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {FirstBoxerGetter, FirstBoxerInterface} from "../../decorators/firstBoxer.decorator";

@DateGetter()
@FirstBoxerGetter()
export class BoxrecPageTitleRow extends BoxrecProfileCommonRow implements DateInterface, FirstBoxerInterface {

    date: string;
    firstBoxer: BoxrecBasic;

    protected readonly $: CheerioStatic;

    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstFighterWeight, false));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.location), 1);
    }

    get metadata(): string | null {
        return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
    }

    // todo can we use parsing helper method?
    get numberOfRounds(): number[] {
        const numberOfRounds: string = trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.rounds, false));
        if (numberOfRounds.includes("/")) {
            // ended early
            return numberOfRounds.split("/").map(item => parseInt(item, 10));
        }

        const parsedNumberOfRounds: number = parseInt(numberOfRounds, 10);
        // went to decision
        return [parsedNumberOfRounds, parsedNumberOfRounds];
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

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.rating));
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
