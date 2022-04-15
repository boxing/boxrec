import {BoutsGetter, BoutsInterface} from '../../decorators/bouts.decorator';
import {OutputGetter, OutputInterface} from '../../decorators/output.decorator';
import {replaceWithWeight, trimRemoveLineBreaks} from '../../helpers';
import {BoxrecBasic} from '../boxrec.constants';
import {BoxrecParseBouts} from '../event/boxrec.parse.bouts';
import {BoxrecPageTitlesRow} from '../titles/boxrec.page.titles.row';
import {BoxrecTitleOutput} from './boxrec.page.title.constants';
import {BoxrecPageTitleRow} from './boxrec.page.title.row';

/**
 * parse a BoxRec Title page
 * <pre>ex. http://boxrec.com/en/title/6/Middleweight
 */
@BoutsGetter('table', BoxrecPageTitlesRow)
@OutputGetter([
    {
        function: (bouts: BoxrecPageTitlesRow[]) => bouts.map(bout => bout.output),
        method: 'bouts',
    },
    'champion',
    'name',
    'numberOfBouts',
])
export class BoxrecPageTitle extends BoxrecParseBouts implements BoutsInterface, OutputInterface {

    /**
     * A list of bouts that have occurred for this title.  Most recent
     * @returns {BoxrecPageTitleRow[]}
     */
    bouts: BoxrecPageTitlesRow[];
    output: BoxrecTitleOutput;

    /**
     * The number of bouts that have occurred for this title
     * @returns {number}
     */
    get numberOfBouts(): number {
        return parseInt(this.$('.pagerResults').text(), 10);
    }

    /**
     * Return id and name of current champion
     * @returns {BoxrecBasic}
     */
    get champion(): BoxrecBasic {
        const championStr: string | null = this.$('#pageOuter h2').html();
        const html: Cheerio = this.$(`<div>${championStr}</div>`);
        const boxerLink: Cheerio = html.find('a');

        if (boxerLink) {
            const link: CheerioElement = boxerLink.get(0);
            const href: RegExpMatchArray | null = link.attribs.href.match(/(\d+)$/);

            if (href && href[1]) {
                return {
                    id: parseInt(href[1], 10),
                    name: trimRemoveLineBreaks(html.text()),
                };
            }
        }

        return {
            id: null,
            name: null,
        };
    }

    get name(): string {
        return replaceWithWeight(this.$('#pageOuter h1').text());
    }

}
