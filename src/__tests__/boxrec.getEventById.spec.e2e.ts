import {WinLossDraw} from '../boxrec-pages/boxrec.constants';
import {BoxrecPageEvent} from '../boxrec-pages/event/boxrec.page.event';
import {BoxrecPageEventBoutRow} from '../boxrec-pages/event/boxrec.page.event.bout.row';
import {Boxrec} from '../boxrec.class';
import {logIn, wait} from './helpers';

jest.setTimeout(200000);

describe('method getEventById', () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    const events: Map<number, BoxrecPageEvent> = new Map();
    const getEvent: (id: number) => BoxrecPageEvent =
        (id: number): BoxrecPageEvent => events.get(id) as BoxrecPageEvent;

    beforeAll(async () => {
        events.set(752960, await Boxrec.getEventById(loggedInCookie, 752960)); // Mayweather McGregor
        await wait();
    });

    it('should return the venue name', () => {
        expect(getEvent(752960).location.venue.name).toBe('T-Mobile Arena');
    });

    it('should return a list of bouts', () => {
        expect(getEvent(752960).bouts.length).not.toBe(0);
    });

    it('should return 0 wins/loss/draw for a boxer on his debut fight', () => {
        const results: BoxrecPageEvent = getEvent(752960);
        expect(results.bouts[2].secondBoxerRecord.win).toBe(0);
        expect(results.bouts[2].secondBoxerRecord.loss).toBe(0);
        expect(results.bouts[2].secondBoxerRecord.draw).toBe(0);
    });

    it('should return a list of doctors', () => {
        expect(getEvent(752960).doctors[0].id).toBeGreaterThanOrEqual(411000);
    });

    describe('getter bout', () => {

        let bout: BoxrecPageEventBoutRow;

        beforeAll(() => {
            bout = getEvent(752960).bouts[0];
        });

        it('should return the second boxer\'s record', () => {
            expect(bout.secondBoxerRecord).toEqual({
                draw: 2,
                loss: 1,
                win: 21,
            });
        });

        it('should return the second boxer\'s last 6', () => {
            expect(bout.secondBoxerLast6).toEqual([WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.draw]);
        });

    });

});
