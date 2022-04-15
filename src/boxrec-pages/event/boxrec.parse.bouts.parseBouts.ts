import * as cheerio from 'cheerio';

export abstract class BoxrecParseBoutsParseBouts {

    protected $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    protected returnBouts(): Array<[string, string | null]> {
        const bouts: Array<[string, string | null]> = [];

        this.$('tbody tr').each((i: number, elem: CheerioElement) => {
            const boutId: string = this.$(elem).attr('id');

            // skip rows that are associated with the previous fight
            if (!boutId || boutId.includes('second')) {
                return;
            }

            // we need to check to see if the next row is associated with this bout
            let isNextRowAssociated: boolean = false;
            let nextRow: Cheerio | null = this.$(elem).next();
            let nextRowId: string = nextRow.attr('id');

            if (nextRowId) {
                nextRowId = nextRowId.replace(/[a-zA-Z]/g, '');

                isNextRowAssociated = nextRowId === boutId;
                if (!isNextRowAssociated) {
                    nextRow = null;
                }
            } // else if no next bout exists

            const html: string = this.$(elem).html() || '';
            const next: string | null = nextRow ? nextRow.html() : null;
            bouts.push([html, next]);
        });

        return bouts;
    }

}
