import {BoxrecFighterRole} from 'boxrec-requests';
import * as cheerio from 'cheerio';
import {BoxrecCommonTablesColumnsClass} from '../../boxrec-common-tables/boxrec-common-tables-columns.class';
import {DivisionGetter, DivisionInterface} from '../../decorators/division.decorator';
import {IdGetter, IdInterface} from '../../decorators/id.decorator';
import {OutputGetter, OutputInterface} from '../../decorators/output.decorator';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from '../../helpers';
import {BoxrecLocation, Record, WinLossDraw} from '../boxrec.constants';
import {WeightDivision} from '../champions/boxrec.champions.constants';
import {BoxrecPageSearchRowOutput} from './boxrec.search.constants';

// includes BoxRec role regardless of searching for all fighters or a specific fight role
@DivisionGetter()
@IdGetter()
@OutputGetter(['alias', 'career', 'division', 'id', 'last6', 'name', 'record', 'residence',
    'sport' // todo is not part roles other than fighters
])
export class BoxrecPageSearchRow implements DivisionInterface, IdInterface, OutputInterface {

    division: WeightDivision | null;
    id: number;
    output: BoxrecPageSearchRowOutput;

    private readonly $: CheerioStatic;

    constructor(private headerColumns: string[], boxrecBodySearchRow: string) {
        const html: string = `<table><tr>${boxrecBodySearchRow}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get alias(): string | null {
        const alias: string = `<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name)}</div>`;
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$(alias).find('span').text());
    }

    get career(): Array<number | null> {
        return BoxrecCommonTablesColumnsClass.parseCareer(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.career, false));
    }

    get last6(): WinLossDraw[] {
        return BoxrecCommonTablesColumnsClass.parseLast6Column(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.firstLast6));
    }

    get name(): string | null {
        const nameIdEl: string = `<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.name)}</div>`;
        return BoxrecCommonTablesColumnsClass.parseAlias(this.$(nameIdEl).find('a').text());
    }

    get record(): Record {
        return BoxrecCommonTablesColumnsClass.parseRecord(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.record));
    }

    get residence(): BoxrecLocation {
        return BoxrecCommonTablesColumnsClass.parseLocationLink(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.residence));
    }

    // todo this should be an array?
    get sport(): BoxrecFighterRole {
        // todo should this be the URL role or the text role?  Do we need a `parseSport` method?
        return trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.sport)) as BoxrecFighterRole;
    }

}
