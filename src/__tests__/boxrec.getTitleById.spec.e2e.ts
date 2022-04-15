import {BoxrecPageTitle} from '../boxrec-pages/title/boxrec.page.title';
import {BoxrecPageTitlesRow} from '../boxrec-pages/titles/boxrec.page.titles.row';
import {Boxrec} from '../boxrec.class';
import {expectMatchDate, logIn, wait} from './helpers';

jest.setTimeout(200000);

describe('method getTitleById', () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    const WBCMiddleweightEndpoint: string = '6/Middleweight';
    let WBCMiddleweightResult: BoxrecPageTitle;

    beforeAll(async () => {
        WBCMiddleweightResult = await Boxrec.getTitleById(loggedInCookie, WBCMiddleweightEndpoint);
        await wait();
    });

    describe('getter name', () => {

        it('should return the name of the title', () => {
            expect(WBCMiddleweightResult.name).toBe('World Boxing Council World Middleweight Title');
        });

    });

    describe('getter champion', () => {

        it('should return the name and id of current champion', () => {
            expect(WBCMiddleweightResult.champion).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

    });

    describe('getter numberOfBouts', () => {

        it('should return the number of bouts that have occurred for this title', () => {
            expect(WBCMiddleweightResult.numberOfBouts).toBeGreaterThanOrEqual(111);
        });

    });

    describe('getter bouts', () => {

        it('should return an array of bouts that occurred for this title', () => {
            expect(WBCMiddleweightResult.bouts).toEqual(jasmine.any(Array));
        });

        describe('bout values', () => {

            let mostRecentWBCBout: BoxrecPageTitlesRow;

            beforeAll(() => {
                mostRecentWBCBout = WBCMiddleweightResult.bouts[0];
            });

            it('should include the date', () => {
                expectMatchDate(mostRecentWBCBout.date);
            });

            it('should include the name and id of the first boxer', () => {
                expect(mostRecentWBCBout.firstBoxer.id).not.toBeNull();
                expect(mostRecentWBCBout.firstBoxer.name).not.toBeNull();
            });

            it('should include the name and id of the second boxer', () => {
                expect(mostRecentWBCBout.secondBoxer.id).not.toBeNull();
                expect(mostRecentWBCBout.secondBoxer.name).not.toBeNull();
            });

            it('should include the number of rounds', () => {
                expect(mostRecentWBCBout.numberOfRounds[0]).toBeGreaterThan(0);
                expect(mostRecentWBCBout.numberOfRounds[1]).toBeGreaterThan(0);
            });

        });

    });

});
