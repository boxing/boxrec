import {BoxrecDate, BoxrecFighterOption, BoxrecRole, Country} from 'boxrec-requests';
import {expectId, expectMatchDate, logIn, wait} from './__tests__/helpers';
import {WinLossDraw} from './boxrec-pages/boxrec.constants';
import {BoxrecPageDate} from './boxrec-pages/date/boxrec.page.date';
import {BoxrecPageEvent} from './boxrec-pages/event/boxrec.page.event';
import {BoxrecPageEventBoutRow} from './boxrec-pages/event/boxrec.page.event.bout.row';
import {BoxrecPageLocationEvent} from './boxrec-pages/location/event/boxrec.page.location.event';
import {BoxrecPageProfileBoxer} from './boxrec-pages/profile/boxrec.page.profile.boxer';
import {BoxrecPageProfileEvents} from './boxrec-pages/profile/boxrec.page.profile.events';
import {BoxrecPageProfileManager} from './boxrec-pages/profile/boxrec.page.profile.manager';
import {BoxrecPageProfileOtherCommon} from './boxrec-pages/profile/boxrec.page.profile.other.common';
import {BoxrecPageRatings} from './boxrec-pages/ratings/boxrec.page.ratings';
import {BoxrecStatus} from './boxrec-pages/search/boxrec.search.constants';
import {WeightDivisionCapitalized} from './boxrec-pages/titles/boxrec.page.title.constants';
import {BoxrecPageTitles} from './boxrec-pages/titles/boxrec.page.titles';
import {BoxrecPageTitlesRow} from './boxrec-pages/titles/boxrec.page.titles.row';
import {BoxrecPageVenue} from './boxrec-pages/venue/boxrec.page.venue';
import {BoxrecPageWatchRow} from './boxrec-pages/watch/boxrec.page.watch.row';
import {Boxrec} from './boxrec.class';

export const {BOXREC_USERNAME, BOXREC_PASSWORD} = process.env;

if (!BOXREC_USERNAME) {
    throw new Error('missing required env var BOXREC_USERNAME');
}

if (!BOXREC_PASSWORD) {
    throw new Error('missing required env var BOXREC_PASSWORD');
}

jest.setTimeout(2000000);

describe('class Boxrec (E2E)', () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    describe('method getRatings', () => {

        let ratings: BoxrecPageRatings;

        beforeAll(async () => {
            ratings = await Boxrec.getRatings(loggedInCookie, {
                sex: 'M',
            });
            await wait();
        });

        describe('getter numberOfPages', () => {

            it('should return the number of pages', () => {
                expect(ratings.numberOfPages).toBeGreaterThanOrEqual(0);
            });

        });

    });

    describe('method getBoxerPDF', () => {

        it('should return a PDF', async () => {
            const pdf: string = await Boxrec.getBoxerPDF(loggedInCookie, 352, './tmp/');
            await wait();
            expect(pdf).toBeDefined();
            expect(pdf).not.toBeNull();
            expect(pdf).not.toContain('DOCTYPE');
            expect(pdf).toContain('PDF-1.4');
        });

    });

    describe('method getBoxerPrint', () => {

        it('should return the printable version of the profile', async () => {
            const print: string = await Boxrec.getBoxerPrint(loggedInCookie, 352, './tmp/');
            await wait();
            expect(print).toBeDefined();
            expect(print).not.toBeNull();
        });

    });

    describe('method getDate', () => {

        // we get two different dates, one a previous date and one from the future
        // the reason is because the data and number of columns changes whether the event has occurred or not
        let sept282019: BoxrecPageDate;
        let nextDate: BoxrecPageDate;

        beforeAll(async () => {
            sept282019 = await Boxrec.getDate(loggedInCookie, {
                day: 28,
                month: 9,
                year: 2019,
            });
            await wait();

            // get the next saturday, there's very few times (if ever) where there won't be a boxing match
            // not timezone proof.  Depending on who/what runs this, it may return Friday/Sunday
            const nextSaturdayDateObject: BoxrecDate = (() => {
                const currentDate: Date = new Date();
                const resultDate: Date = new Date(currentDate.getTime());
                resultDate.setDate(currentDate.getDate() + (7 + 6 - currentDate.getDay()) % 7);
                let year: number = resultDate.getFullYear();
                let month: number = resultDate.getMonth() + 1;

                if (month > 11) {
                    month = 0;
                    year++;
                }

                return {
                    day: resultDate.getDate(),
                    month,
                    year,
                };
            })();

            nextDate = await Boxrec.getDate(loggedInCookie,
                nextSaturdayDateObject);
            await wait();
        });

        describe('past date', () => {

            describe('getter events', () => {

                describe('getter bouts', () => {

                    describe('getter firstBoxerRecord', () => {

                        it('should return the first boxer\'s record', () => {
                            expect(sept282019.events[0].bouts[0].firstBoxerRecord).toEqual({
                                draw: jasmine.any(Number),
                                loss: jasmine.any(Number),
                                win: jasmine.any(Number),
                            });
                        });

                    });

                    describe('getter firstBoxerWeight', () => {

                        it('should not return null as there should have been a weigh in', () => {
                            expect(sept282019.events[0].bouts[0].firstBoxerWeight).toEqual(jasmine.any(Number));
                        });

                    });

                    describe('getter outcomeByWayOf', () => {

                        it('should return a value as the bout has happened', () => {
                            expect(sept282019.events[0].bouts[0].outcomeByWayOf).not.toBeNull();
                        });

                    });

                    describe('getter outcome', () => {

                        it('should return a value as the bout has happened', () => {
                            expect([WinLossDraw.win, WinLossDraw.loss, WinLossDraw.draw])
                                .toContain(sept282019.events[0].bouts[0].outcome);
                        });

                    });

                    describe('links', () => {

                        it('should return a bout ID in the links', () => {
                            expect(sept282019.events[0].bouts[0].links.bout).toMatch(/\d+\/\d+/);
                        });

                    });

                    describe('rating', () => {

                        it('should return the rating of the bout', () => {
                            expect(sept282019.events[0].bouts[0].rating).toBe(20);
                        });

                    });

                });

            });

        });

        describe('future date', () => {

            describe('getter events', () => {

                describe('getter bouts', () => {

                    describe('getter firstBoxerRecord', () => {

                        it('should return the first boxer\'s record', () => {
                            expect(nextDate.events[0].bouts[0].firstBoxerRecord).toEqual({
                                draw: jasmine.any(Number),
                                loss: jasmine.any(Number),
                                win: jasmine.any(Number),
                            });
                        });

                    });

                    describe('getter firstBoxerWeight', () => {

                        it('should return null as there hasn\'t been a weigh in', () => {
                            expect(nextDate.events[0].bouts[0].firstBoxerWeight).toBeNull();
                        });

                    });

                    describe('getter outcomeByWayOf', () => {

                        it('should return null as the bout has not happened', () => {
                            expect(nextDate.events[0].bouts[0].outcomeByWayOf).toBeNull();
                        });

                    });

                    describe('getter outcome', () => {

                        it('should return `scheduled` as the bout has not happened', () => {
                            expect(nextDate.events[0].bouts[0].outcome).toBe(WinLossDraw.scheduled);
                        });

                    });

                });

            });

        });

    });

    describe('method getPeopleByName', () => {

        let results: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>;
        let nextResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>;

        beforeAll(async () => {
            results = await Boxrec.getPeopleByName(loggedInCookie, 'Floyd', 'Mayweather');
            await wait();
            nextResults = await Boxrec.getPeopleByName(loggedInCookie, 'Floyd', 'Mayweather',
                BoxrecRole.proBoxer, BoxrecStatus.all, 20);
            await wait();
        });

        it('should return Floyd Sr. and then Floyd Jr.', async () => {
            let boxer: IteratorResult<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await results.next();
            expect(boxer.value.globalId).toEqual(15480);
            boxer = await results.next();
            expect(boxer.value.globalId).toEqual(352);
        });

        it('should return different results if `offset` is used', async () => {
            const boxer: IteratorResult<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await nextResults.next();
            // we expect only one page when searching Floyd Mayweather
            expect(boxer.value).toBeUndefined();
            expect(boxer.done).toBe(true);
        });

    });

    describe('method getVenueById', () => {

        let venue: BoxrecPageVenue;

        beforeAll(async () => {
            venue = await Boxrec.getVenueById(loggedInCookie, 37664);
            await wait();
        });

        it('should return the name of the venue', () => {
            expect(venue.name).toBe('Boardwalk Hall');
        });

        it('should return the location of the venue as an object', () => {
            expect(venue.location.region).toEqual({
                id: 'NJ',
                name: 'New Jersey',
            });
        });

        it('should include local boxers in an array', () => {
            expect(venue.localBoxers[0]).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

        it('should include local managers in an array', () => {
            expect(venue.localManagers[0]).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

        describe('getter events', () => {

            it('should give the dates of events', () => {
                expectMatchDate(venue.events[0].date);
            });

        });

    });

    describe('method getEventById', () => {

        const events: Map<number, BoxrecPageEvent> = new Map();
        const getEvent: (id: number) => BoxrecPageEvent =
            (id: number): BoxrecPageEvent => events.get(id) as BoxrecPageEvent;

        beforeAll(async () => {
            events.set(765205, await Boxrec.getEventById(loggedInCookie, 765205)); // Linares Lomachenko
            await wait();
            events.set(752960, await Boxrec.getEventById(loggedInCookie, 752960)); // Mayweather McGregor
            await wait();
        });

        it('should return the venue name', () => {
            expect(getEvent(765205).location.venue.name).toBe('Madison Square Garden');
        });

        it('should return a list of bouts', () => {
            expect(getEvent(765205).bouts.length).not.toBe(0);
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
                bout = getEvent(765205).bouts[0];
            });

            it('should return the second boxer\'s record', () => {
                expect(bout.secondBoxerRecord).toEqual({
                    draw: 0,
                    loss: 1,
                    win: 10,
                });
            });

            it('should return the second boxer\'s last 6', () => {
                expect(bout.secondBoxerLast6).toEqual(new Array(6).fill(WinLossDraw.win));
            });

        });

    });

    describe('method getEventByLocation', () => {

        let events: BoxrecPageLocationEvent;
        let nextEvents: BoxrecPageLocationEvent;

        beforeAll(async () => {
            events = await Boxrec.getEventsByLocation(loggedInCookie, {
                country: Country.USA,
                sport: BoxrecFighterOption['Pro Boxing'],
                year: 2017,
            });
            await wait();
            nextEvents = await Boxrec.getEventsByLocation(loggedInCookie, {
                country: Country.USA,
                sport: BoxrecFighterOption['Pro Boxing'],
                year: 2017,
            }, 20);
            await wait();
        });

        it('should return an array of events', async () => {
            expect(events.events.length).toBeGreaterThan(0);
        });

        it('should return the number of locations', () => {
            expect(events.numberOfLocations).toBeGreaterThanOrEqual(604);
        });

        it('should return the venue', () => {
            expect(events.events[0].venue).toEqual({
                id: 34612,
                name: 'Rapides Coliseum',
            });
        });

        it('should return the location', () => {
            expect(events.events[0].location).toEqual({
                country: {
                    id: Country.USA,
                    name: 'USA',
                },
                region: {
                    id: 'LA',
                    name: 'Louisiana',
                },
                town: {
                    id: 19077,
                    name: 'Alexandria',
                }
            });
        });

        it('should return the date of the bout', () => {
            expectMatchDate(events.events[0].date);
        });

        it('should return the event id as id', () => {
            expectId(events.events[0].id, 762353);
        });

        it('should offset the results if using the `offset` param', () => {
            expect(events.events[0].id).not.toBe(nextEvents.events[0].id);
        });

        it('should return the number of pages', () => {
            expect(events.numberOfPages).toBeGreaterThan(30);
        });

    });

    describe('method getTitles', () => {

        let titleBouts: BoxrecPageTitles;

        beforeAll(async () => {
            titleBouts = await Boxrec.getTitles(loggedInCookie, {
                bout_title: 322,
                division: WeightDivisionCapitalized.welterweight,
            });
            await wait();
        });

        describe('getter numberOfBouts', () => {

            it('should return the number of bouts, even when less than 20', () => {
                expect(titleBouts.numberOfBouts).toBeGreaterThan(12);
            });

        });

        describe('getter bouts', () => {

            let firstBout: BoxrecPageTitlesRow;

            beforeAll(() => {
                firstBout = titleBouts.bouts[0];
            });

            it('should include the date', () => {
                expect(firstBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
            });

            it('should include the rounds', () => {
                expect(firstBout.numberOfRounds).toEqual([
                    jasmine.any(Number),
                    jasmine.any(Number),
                ]);
            });

        });

    });

    describe('method watch', () => {

        it('should add the boxer to the list', async () => {
            const response: boolean = await Boxrec.watch(loggedInCookie, 447121); // Terence Crawford
            await wait();
            expect(response).toBe(true);
        });

    });

    describe('method getWatched', () => {

        it('should include watched boxers', async () => {
            const response: BoxrecPageWatchRow[] = await Boxrec.getWatched(loggedInCookie);
            await wait();
            const boxer: BoxrecPageWatchRow | undefined = response.find(item => item.globalId === 447121);
            expect(boxer).toBeDefined();
        });

    });

    describe('method unwatch', () => {

        it('should remove the boxer from the list', async () => {
            const response: boolean = await Boxrec.unwatch(loggedInCookie, 447121); // Terence Crawford
            await wait();
            expect(response).toBe(true);
        });

    });

});
