import * as cheerio from 'cheerio';
import {BoxrecCommonTableHeader, getColumnDataByColumnHeader} from '../../../helpers';
import {BoxrecBasic} from '../../boxrec.constants';

export abstract class BoxrecPageEventCommonRow {

    protected readonly $: CheerioStatic;

    constructor(protected headerColumns: string[], boxrecBodyBout: string, additionalData: string | null = null) {
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        this.$ = cheerio.load(html);
    }

    get venue(): BoxrecBasic {
        const html: Cheerio = this.$(`<div>${getColumnDataByColumnHeader(this.$, this.headerColumns,
            BoxrecCommonTableHeader.venue)}</div>`);
        const venue: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find('a').each((i: number, elem: CheerioElement) => {
            const href: RegExpMatchArray | null = this.$(elem).get(0).attribs.href.match(/(\d+)$/);
            if (href) {
                venue.name = this.$(elem).text();
                venue.id = parseInt(href[1], 10);
            }
        });

        return venue;
    }

}
