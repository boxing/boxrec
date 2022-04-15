import {BoxrecPageSchedule} from '../boxrec-pages/schedule/boxrec.page.schedule';
import {Boxrec} from '../boxrec.class';
import {logIn, wait} from './helpers';

jest.setTimeout(200000);

describe('method getResults', () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    let results: BoxrecPageSchedule;
    let nextResults: BoxrecPageSchedule;

    beforeAll(async () => {
        results = await Boxrec.getResults(loggedInCookie, {});
        await wait();
        // note: replace the following if have a reason to grab different schedule data
        nextResults = await Boxrec.getResults(loggedInCookie, {}, 20);
        await wait();
    });

    it('should give an array of events', () => {
        expect(results.events.length).toBeGreaterThanOrEqual(0);
    });

    it('should use the `offset` to give the next results', async () => {
        expect(results.events[0].id).not.toEqual(nextResults.events[0].id);
    });

    describe('getter numberOfPages', () => {

        it('should return the number of pages', () => {
            expect(results.numberOfPages).toBeGreaterThan(0);
        });

    });

});
