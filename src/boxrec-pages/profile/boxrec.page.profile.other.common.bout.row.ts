import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from "../../helpers";
import {BoxrecBasic, BoxrecLocation, Record, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileCommonRow} from "./boxrec.profile.common.row";
import {DateGetter, DateInterface} from "../../decorators/date.decorator";
import {MetadataGetter, MetadataInterface} from "../../decorators/metadata.decorator";

@DateGetter()
@MetadataGetter()
export class BoxrecPageProfileOtherCommonBoutRow extends BoxrecProfileCommonRow
    implements DateInterface, MetadataInterface {

    date: string;
    metadata: string | null;

    // todo used on any profile?
    get firstBoxerRating(): Array<number | null> {
        return BoxrecPageProfileBoxerBoutRow.parseBoxerRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstRating));
    }

    // todo this seems busted, doesn't look like it exists for referee
    get firstBoxerWeight(): number | null {
        return BoxrecCommonTablesColumnsClass.parseWeight(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstFighterWeight, false));
    }

    get location(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.location));
    }

    get numberOfRounds(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseNumberOfRounds(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.rounds, false));
    }

    get outcome(): WinLossDraw {
        return BoxrecCommonTablesColumnsClass.parseOutcome(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.result, false));
    }

    get rating(): number | null {
        return BoxrecCommonTablesColumnsClass.parseRating(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.rating));
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
