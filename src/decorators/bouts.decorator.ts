import {BoxrecPageEventBoutRow} from '../boxrec-pages/event/boxrec.page.event.bout.row';
import {BoxrecPageProfileBoxerBoutRow} from '../boxrec-pages/profile/boxrec.page.profile.boxer.bout.row';
import {BoxrecPageProfileOtherCommonBoutRow} from '../boxrec-pages/profile/boxrec.page.profile.other.common.bout.row';
import {BoxrecPageTitlesRow} from '../boxrec-pages/titles/boxrec.page.titles.row';
import {getHeaderColumnText} from '../helpers';

/**
 * Adds a getter to the class that returns an array of bouts from an events/schedule/date table
 * @param tableEl   table element to parse bouts for
 * @param classType the class instance to return
 * @param theadNumber   some tables the header element that contains the column data is at different points in the table
 * @param reverseOrder  if true, will reverse the order of the returned bouts
 * @constructor
 */
export function BoutsGetter(tableEl: string, classType: (new (headerColumns: string[], tableRowInnerHTML: string,
                                                              metadataFollowingRowInnerHTML: string | null) => any),
                            theadNumber: number = 1, reverseOrder: boolean = false):
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'bouts', {
            get(): Array<[string, string | null]> {
                // on the pages with multiple events, not all tables have the header columns
                // by using the "parse" method we add the header
                // columns to all tables and therefore we can get them in every event
                const headerColumns: string[] = getHeaderColumnText(this.$(tableEl), theadNumber);
                const bouts: Array<[string, string | null]> = this.returnBouts()
                    .map((val: [string, string | null]) => new classType(headerColumns, val[0], val[1]));

                // used for profiles where oldest bouts should be at the start ex. boxers
                if (reverseOrder) {
                    return bouts.reverse();
                }

                return bouts;
            },
        });
    };
}

export interface BoutsInterface {
    readonly bouts: Array<BoxrecPageEventBoutRow | BoxrecPageTitlesRow | BoxrecPageProfileBoxerBoutRow |
        BoxrecPageProfileOtherCommonBoutRow>;
}
