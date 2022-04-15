import * as cheerio from 'cheerio';
import {BoxrecCommonTablesColumnsClass} from '../../boxrec-common-tables/boxrec-common-tables-columns.class';
import {DivisionGetter, DivisionInterface} from '../../decorators/division.decorator';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../../helpers';
import {BoxrecLocation, Record, Stance, WinLossDraw} from '../boxrec.constants';
import {WeightDivision} from '../champions/boxrec.champions.constants';

// used for boxer rows under a manager
@DivisionGetter()
export class BoxrecPageProfileManagerBoxerRow implements DivisionInterface {

    division: WeightDivision | null;

    private readonly $: CheerioStatic;

    constructor(private headerColumns: string[], boxrecBodyString: string) {
        const html: string = `<table><tr>${boxrecBodyString}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get age(): number | null {
        const age: string = getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.age, false);
        if (age) {
            return parseInt(age, 10);
        }

        return null;
    }

    get debut(): string | null {
        const debut: string = getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.debut, false);

        if (debut) {
            return debut;
        }

        return null;
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.firstLast6));
    }

    get name(): string {
        return getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name, false);
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$,
            this.headerColumns, BoxrecCommonTableHeader.record));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.residence));
    }

    get stance(): Stance | null {
        const stance: string = getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.stance, false);

        if (stance) {
            return stance as Stance;
        }

        return null;
    }

}
