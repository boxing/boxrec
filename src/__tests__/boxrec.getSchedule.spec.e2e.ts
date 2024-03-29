import {BoxrecPageEvent} from '../boxrec-pages/event/boxrec.page.event';
import {BoxrecPageSchedule} from '../boxrec-pages/schedule/boxrec.page.schedule';
import {BoxrecScheduleOutput} from '../boxrec-pages/schedule/boxrec.page.schedule.constants';
import {Boxrec} from '../boxrec.class';
import {expectId, expectMatchDate, logIn, wait} from './helpers';

jest.setTimeout(200000);

describe('method getSchedule', () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    let results: BoxrecPageSchedule;
    let nextResults: BoxrecPageSchedule;

    beforeAll(async () => {
        results = await Boxrec.getSchedule(loggedInCookie, {});
        await wait();
    });

    it('should give an array of schedule events', () => {
        expect(results.events.length).toBeGreaterThanOrEqual(0);
    });

    describe('getter numberOfPages', () => {

        it('should return the number of pages', () => {
            expect(results.numberOfPages).toBeGreaterThanOrEqual(0);
        });

    });

    describe('getter output', () => {

        let scheduleOutput: BoxrecScheduleOutput;

        beforeAll(() => {
            scheduleOutput = results.output;
        });

        it('should include a number of events', () => {
            expect(scheduleOutput.events.length).toBeGreaterThan(0);
        });

    });

    // note: these events will change daily
    // some of these tests should either use try/catches or loop through events to satisfy the test case
    describe('getter events', () => {

        let event: BoxrecPageEvent;

        beforeAll(() => {
            event = results.events[0];
        });

        describe('getter date', () => {

            it('should include the date of an event', () => {
                expectMatchDate(event.date);
            });

        });

        describe('getter bouts', () => {

            it('should be defined', () => {
                expect(event.bouts).toBeDefined();
            });

            describe('getter values', () => {

                describe('links', () => {

                    it('should return a bout link', () => {
                        expect(event.bouts[0].links.bout).toMatch(/\d+\/\d+/);
                    });

                    it('should return a wiki link', () => {
                        expect(event.bouts[0].links.bio).toEqual(expect.any(Number));
                    });

                });

                describe('firstBoxer', () => {

                    it('id should not be null', () => {
                        expect(event.bouts[0].firstBoxer.id).not.toBeNull();
                    });

                    it('name should not be null', () => {
                        expect(event.bouts[0].firstBoxer.name).not.toBeNull();
                    });

                });

                it('secondBoxer', () => {
                    // second boxer could be empty, resulting in `null` values
                    expect(event.bouts[0].secondBoxer).toBeDefined();
                });

                describe('getter rating', () => {

                    it('should return a value of 0 or greater', () => {
                        expect(event.bouts[0].rating).toBeGreaterThanOrEqual(0);
                    });

                });

            });

        });

        describe('getter location', () => {

            describe('venue', () => {

                it('should include the id of the venue', () => {
                    expectId(event.location.venue.id, jasmine.any(Number));
                });

                it('should include the name of the venue', () => {
                    expect(event.location.venue.name).toEqual(jasmine.any(String));
                });

            });

            describe('location', () => {

                it('should include the town', () => {
                    expect(event.location.location.town).toBeDefined();
                });

                it('should include the country', () => {
                    expect(event.location.location.country).toEqual({
                        id: jasmine.any(String),
                        name: jasmine.any(String),
                    });
                });

                it('should include the region', () => {
                    // it can be null
                    expect(event.location.location.region).toBeDefined();
                });

            });

        });

        describe('getter promoter', () => {

            it('should include the promotional company in an array', () => {
                expect(event.promoters).toBeDefined();
                expect(event.promoters.length).toBeGreaterThanOrEqual(0);
            });

        });

        describe('getter matchmaker', () => {

            it('should be included if it exists', () => {
                expect(event.matchmakers).toBeDefined();
            });

        });

        describe('getter doctor', () => {

            it('should include an array of doctors', () => {
                expect(event.doctors).toBeDefined();
                expect(event.doctors.length).toBeGreaterThanOrEqual(0);
            });

        });

        describe('getter inspector', () => {

            it('should include the id and name of the inspector', () => {
                expect(event.inspector).toBeDefined();
            });

        });

        it('should include the wiki id as id', () => {
            expect(event.id).toBeGreaterThanOrEqual(0);
        });

    });

    describe('when getting next page result', () => {

        beforeAll(async () => {
            // note: replace the following if have a reason to grab different schedule data
            nextResults = await Boxrec.getSchedule(loggedInCookie, {}, 20);
            await wait();
        });

        it('should use the `offset` to give the next results', async () => {
            expect(results.events[0].id).not.toEqual(nextResults.events[0].id);
        });
    });

});
