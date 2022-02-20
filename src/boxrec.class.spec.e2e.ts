import {BoxrecFighterOption, BoxrecRole, Sport} from "boxrec-requests/dist/boxrec-requests.constants";
import {CookieJar} from "request";
import {expectId, expectMatchDate, logIn} from "./__tests__/helpers";
import {WinLossDraw} from "./boxrec-pages/boxrec.constants";
import {WeightDivision} from "./boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageDate} from "./boxrec-pages/date/boxrec.page.date";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecPageEventBoutRow} from "./boxrec-pages/event/boxrec.page.event.bout.row";
import {BoxrecPageLocationEvent} from "./boxrec-pages/location/event/boxrec.page.location.event";
import {Country} from "./boxrec-pages/location/people/boxrec.location.people.constants";
import {BoxrecPageLocationPeople} from "./boxrec-pages/location/people/boxrec.page.location.people";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";
import {BoxrecPageProfileOtherCommon} from "./boxrec-pages/profile/boxrec.page.profile.other.common";
import {BoxrecPageProfilePromoter} from "./boxrec-pages/profile/boxrec.page.profile.promoter";
import {BoxrecPageRatings} from "./boxrec-pages/ratings/boxrec.page.ratings";
import {BoxrecPageSchedule} from "./boxrec-pages/schedule/boxrec.page.schedule";
import {BoxrecStatus} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageTitle} from "./boxrec-pages/title/boxrec.page.title";
import {WeightDivisionCapitalized} from "./boxrec-pages/titles/boxrec.page.title.constants";
import {BoxrecPageTitles} from "./boxrec-pages/titles/boxrec.page.titles";
import {BoxrecPageTitlesRow} from "./boxrec-pages/titles/boxrec.page.titles.row";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";
import {BoxrecPageWatchRow} from "./boxrec-pages/watch/boxrec.page.watch.row";
import {Boxrec} from "./boxrec.class";
import DoneCallback = jest.DoneCallback;

export const {BOXREC_USERNAME, BOXREC_PASSWORD} = process.env;

if (!BOXREC_USERNAME) {
    throw new Error("missing required env var BOXREC_USERNAME");
}

if (!BOXREC_PASSWORD) {
    throw new Error("missing required env var BOXREC_PASSWORD");
}

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

jest.setTimeout(30000);

// 15000 was fine
const wait: (done: DoneCallback) => void = (done: DoneCallback) => setTimeout(done, 15000);

describe("class Boxrec (E2E)", () => {

    let loggedInCookie: CookieJar;
    let num: number = 0;

    beforeAll(async (done: DoneCallback) => {
        const logInResponse: { madeRequest: boolean, cookieJar: CookieJar} = await logIn();
        loggedInCookie = logInResponse.cookieJar;

        if (logInResponse.madeRequest) {
            wait(done);
        } else {
            done();
        }
    });

    // delay each test so we don't get blocked by BoxRec
    beforeEach(done => {
        num++;
        // tslint:disable-next-line:no-console
        console.log(num);
        wait(done);
    });

    describe("method getPersonById", () => {

        type Person =
            BoxrecPageProfileBoxer
            | BoxrecPageProfileOtherCommon
            | BoxrecPageProfileEvents
            | BoxrecPageProfileManager;

        const boxers: Map<number, Person> = new Map();
        const getBoxer: (id: number) => any =
            (id: number): Person | undefined => boxers.get(id);

        beforeAll(async () => {
            // Floyd Mayweather Jr.
            boxers.set(352, await Boxrec.getPersonById(loggedInCookie, 352, BoxrecRole.proBoxer));
            // Sugar Ray Robinson
            boxers.set(9625, await Boxrec.getPersonById(loggedInCookie, 9625, BoxrecRole.proBoxer));
            // Saul Alvarez
            boxers.set(348759, await Boxrec.getPersonById(loggedInCookie, 348759, BoxrecRole.proBoxer));
        });

        describe("where role is boxer", () => {

            describe("enrollments", () => {

                it("should return an empty array if they have none", () => {
                    expect(getBoxer(9625).enrollments).toEqual([]);
                });

                describe("when a boxer has enrollments", () => {

                    let enrolledBoxer: any;

                    beforeAll(() => {
                        enrolledBoxer = getBoxer(348759).enrollments;
                    });

                    it("should return who", () => {
                        expect(enrolledBoxer[0].by).toBe("Voluntary Anti-Doping Association (VADA) CBP");
                    });

                    it("should return the expiry date", () => {
                        expect(enrolledBoxer[0].expires).toBe("2020-10-15");
                    });

                    it("should return the id of the enrollment", () => {
                        expect(enrolledBoxer[0].id).toBe(348759);
                    });

                    it("should return the sport", () => {
                        expect(enrolledBoxer[0].sport).toBe(Sport.proBoxing);
                    });

                });

            });

            it("should return the person's information", () => {
                expect(getBoxer(352).name).toBe("Floyd Mayweather Jr");
            });

            it("should include the person's alias", () => {
                expect(getBoxer(352).alias).toBe("Money / Pretty Boy");
            });

            describe("number of bouts", () => {

                it("should include the number of bouts they were in", () => {
                    expect(getBoxer(352).bouts.length).toBe(50);
                });

                it("should break number of boxer bouts to multiple pages", async () => {
                    const sugarRayRobinsonPage1: BoxrecPageProfileBoxer = boxers.get(9625) as BoxrecPageProfileBoxer;
                    const sugarRayRobinsonPage2: BoxrecPageProfileBoxer =
                        await Boxrec.getPersonById(loggedInCookie, 9625, BoxrecRole.proBoxer,
                            sugarRayRobinsonPage1.bouts.length) as BoxrecPageProfileBoxer;

                    expect(sugarRayRobinsonPage1.bouts[0].secondBoxer.name)
                        .not.toEqual(sugarRayRobinsonPage2.bouts[0].secondBoxer.name);
                });

            });

            it("should return if they are suspended or not", () => {
                expect(getBoxer(352).suspended).toBe(null);
            });

            it("should include their role as a boxer", () => {
                expect(getBoxer(352).role).toEqual([{
                    id: 352,
                    name: BoxrecRole.proBoxer,
                }]);
            });

            describe("bouts", () => {

                it("should return an array of bouts", () => {
                    expect(getBoxer(352).bouts.length).toBeGreaterThanOrEqual(49);
                });

                it("should return the opponent's name", () => {
                    expect(getBoxer(352).bouts[49].secondBoxer.name).toBe("Conor McGregor");
                });

                describe("location", () => {

                    it("should return the venue name", () => {
                        expect(getBoxer(352).bouts[49].location).toBe("T-Mobile Arena, Las Vegas");
                    });

                });

                describe("firstBoxerRating", () => {

                    it("should return the boxer rating before and after the bout", () => {
                        expect(getBoxer(352).bouts[49].firstBoxerRating)
                            .toEqual([jasmine.any(Number), jasmine.any(Number)]);
                    });

                    it("should strip all commas from the rating", () => {
                        expect(getBoxer(352).bouts[47].firstBoxerRating)
                            .toEqual([jasmine.any(Number), jasmine.any(Number)]);
                    });

                });

                describe("secondBoxerRating", () => {

                    it("should return the boxer rating before and after the bout", () => {
                        expect(getBoxer(352).bouts[49].secondBoxerRating)
                            .toEqual([jasmine.any(Number), jasmine.any(Number)]);
                    });

                    it("should strip all commas from the rating", () => {
                        expect(getBoxer(352).bouts[47].secondBoxerRating)
                            .toEqual([jasmine.any(Number), jasmine.any(Number)]);
                    });

                });

                describe("last 6", () => {

                    it("should return an empty array if it's the boxer's debut bout", () => {
                        expect(getBoxer(352).bouts[49].secondBoxerLast6).toEqual([]);
                    });

                });

                describe("weight", () => {

                    it("should change fractions to decimals", () => {
                        expect(getBoxer(352).bouts[49].firstBoxerWeight).toBe(149.5);
                    });

                });

                describe("links", () => {

                    it("should return an object of links", () => {
                        expect(getBoxer(352).bouts[49].links.event).toBe(752960);
                    });

                });

            });

        });

        describe("where role is judge", () => {

            let judge: BoxrecPageProfileOtherCommon;

            beforeAll(async () => {
                judge = await Boxrec.getPersonById(loggedInCookie, 401615, BoxrecRole.judge) as
                    BoxrecPageProfileOtherCommon;
            });

            it("should return the person's information", () => {
                expect(judge.name).toBe("CJ Ross");
            });

            it("should also have bouts to parse that they were a part of", () => {
                expect(judge.bouts).toEqual(jasmine.any(Array));
            });

        });

        describe("where role is doctor", () => {

            let doctor: BoxrecPageProfileEvents;

            beforeAll(async () => {
                doctor = await Boxrec
                    .getPersonById(loggedInCookie, 412676, BoxrecRole.doctor) as BoxrecPageProfileEvents;
            });

            it("should return the person's information", () => {
                expect(doctor.name).toBe("Anthony Ruggeroli");
            });

            it("should return an array of events", () => {
                expect(doctor.events).toEqual(jasmine.any(Array));
                expect(doctor.events.length).toBeGreaterThan(10);
            });

        });

        describe("where role is promoter", () => {

            let promoter: BoxrecPageProfilePromoter;

            beforeAll(async () => {
                promoter = await Boxrec.getPersonById(loggedInCookie, 419406, BoxrecRole.promoter) as BoxrecPageProfilePromoter;
            });

            it("should return the company name", () => {
                expect(promoter.company).toBe("Mayweather Promotions");
            });

        });

        it("should return the URL of the person's profile picture", () => {
            expect((boxers.get(352) as BoxrecPageProfileBoxer).picture).toContain("FloydMayweather");
        });

        it("should include the death date if the person has passed away and the date is known", async () => {
            const louDuva: BoxrecPageProfileEvents = await Boxrec.getPersonById(loggedInCookie,
                24678, BoxrecRole.promoter) as BoxrecPageProfileEvents;
            expect(louDuva.death).toBe("2017-03-08");

        });

        it("should return an array of their social media links", () => {
            const socialMediaFloyd: string[] = (boxers.get(352) as BoxrecPageProfileBoxer).socialMedia;
            const floydTwitter: string | undefined = socialMediaFloyd
                .find(item => /(https?\:\/\/)?twitter\.com\/FloydMayweather/.test(item));
            expect(floydTwitter).toBeDefined();
        });

    });

    describe("method getResults", () => {

        let results: BoxrecPageSchedule;
        let nextResults: BoxrecPageSchedule;

        beforeAll(async () => {
            results = await Boxrec.getResults(loggedInCookie, {});
            // note: replace the following if have a reason to grab different schedule data
            nextResults = await Boxrec.getResults(loggedInCookie, {}, 20);
        });

        it("should give an array of events", () => {
            expect(results.events.length).toBeGreaterThanOrEqual(0);
        });

        it("should use the `offset` to give the next results", async () => {
            expect(results.events[0].id).not.toEqual(nextResults.events[0].id);
        });

        describe("getter numberOfPages", () => {

            it("should return the number of pages", () => {
                expect(results.numberOfPages).toBeGreaterThan(0);
            });

        });

    });

    describe("method getRatings", () => {

        let ratings: BoxrecPageRatings;

        beforeAll(async () => {
            ratings = await Boxrec.getRatings(loggedInCookie, {
                sex: "M",
            });
        });

        describe("getter numberOfPages", () => {

            it("should return the number of pages", () => {
                expect(ratings.numberOfPages).toBeGreaterThanOrEqual(0);
            });

        });

    });

    describe("method getSchedule", () => {

        let results: BoxrecPageSchedule;
        let nextResults: BoxrecPageSchedule;

        beforeAll(async () => {
            results = await Boxrec.getSchedule(loggedInCookie, {});
            // note: replace the following if have a reason to grab different schedule data
            nextResults = await Boxrec.getSchedule(loggedInCookie, {}, 20);
        });

        it("should give an array of schedule events", () => {
            expect(results.events.length).toBeGreaterThanOrEqual(0);
        });

        it("should use the `offset` to give the next results", async () => {
            expect(results.events[0].id).not.toEqual(nextResults.events[0].id);
        });

        describe("getter numberOfPages", () => {

            it("should return the number of pages", () => {
                expect(results.numberOfPages).toBeGreaterThanOrEqual(0);
            });

        });

        // note: these events will change daily
        // some of these tests should either use try/catches or loop through events to satisfy the test case
        describe("getter events", () => {

            let event: BoxrecPageEvent;

            beforeAll(() => {
                event = results.events[0];
            });

            describe("getter date", () => {

                it("should include the date of an event", () => {
                    expectMatchDate(event.date);
                });

            });

            describe("getter bouts", () => {

                it("should be defined", () => {
                    expect(event.bouts).toBeDefined();
                });

                describe("getter values", () => {

                    describe("firstBoxer", () => {

                        it("id should not be null", () => {
                            expect(event.bouts[0].firstBoxer.id).not.toBeNull();
                        });

                        it("name should not be null", () => {
                            expect(event.bouts[0].firstBoxer.name).not.toBeNull();
                        });

                    });

                    it("secondBoxer", () => {
                        // second boxer could be empty, resulting in `null` values
                        expect(event.bouts[0].secondBoxer).toBeDefined();
                    });

                    describe("getter rating", () => {

                        it("should return a value of 0 or greater", () => {
                            expect(event.bouts[0].rating).toBeGreaterThanOrEqual(0);
                        });

                    });

                });

            });

            describe("getter location", () => {

                describe("venue", () => {

                    it("should include the id of the venue", () => {
                        expectId(event.location.venue.id, jasmine.any(Number));
                    });

                    it("should include the name of the venue", () => {
                        expect(event.location.venue.name).toEqual(jasmine.any(String));
                    });

                });

                describe("location", () => {

                    it("should include the town", () => {
                        expect(event.location.location.town).toBeDefined();
                    });

                    it("should include the country", () => {
                        expect(event.location.location.country).toEqual({
                            id: jasmine.any(String),
                            name: jasmine.any(String),
                        });
                    });

                    it("should include the region", () => {
                        // it can be null
                        expect(event.location.location.region).toBeDefined();
                    });

                });

            });

            describe("getter promoter", () => {

                it("should include the promotional company in an array", () => {
                    expect(event.promoters).toBeDefined();
                    expect(event.promoters.length).toBeGreaterThanOrEqual(0);
                });

            });

            describe("getter matchmaker", () => {

                it("should be included if it exists", () => {
                    expect(event.matchmakers).toBeDefined();
                });

            });

            describe("getter doctor", () => {

                it("should include an array of doctors", () => {
                    expect(event.doctors).toBeDefined();
                    expect(event.doctors.length).toBeGreaterThanOrEqual(0);
                });

            });

            describe("getter inspector", () => {

                it("should include the id and name of the inspector", () => {
                    expect(event.inspector).toBeDefined();
                });

            });

            it("should include the wiki id as id", () => {
                expect(event.id).toBeGreaterThanOrEqual(0);
            });

        });

    });

    describe("method getBoxerPDF", () => {

        it("should return a PDF", async () => {
            const pdf: string = await Boxrec.getBoxerPDF(loggedInCookie, 352);
            expect(pdf).toBeDefined();
            expect(pdf).not.toBeNull();
        });

    });

    describe("method getBoxerPrint", () => {

        it("should return the printable version of the profile", async () => {
            const print: string = await Boxrec.getBoxerPrint(loggedInCookie, 352);
            expect(print).toBeDefined();
            expect(print).not.toBeNull();
        });

    });

    describe("method getDate", () => {

        // we get two different dates, one a previous date and one from the future
        // the reason is because the data and number of columns changes whether the event has occurred or not
        let sept282019: BoxrecPageDate;
        let nextDate: BoxrecPageDate;

        beforeAll(async () => {
            sept282019 = await Boxrec.getDate(loggedInCookie, "2019-09-28");

            // get the next saturday, there's very few times (if ever) where there won't be a boxing match
            // not timezone proof.  Depending on who/what runs this, it may return Friday/Sunday
            function getNextSaturdayDateObject(): Date {
                const currentDate: Date = new Date();
                const resultDate: Date = new Date(currentDate.getTime());
                resultDate.setDate(currentDate.getDate() + (7 + 6 - currentDate.getDay()) % 7);
                return resultDate;
            }

            nextDate = await Boxrec.getDate(loggedInCookie,
                getNextSaturdayDateObject().toISOString().substr(0, 10));
        });

        describe("passed date", () => {

            describe("getter events", () => {

                describe("getter bouts", () => {

                    describe("getter firstBoxerRecord", () => {

                        it("should return the first boxer's record", () => {
                            expect(sept282019.events[0].bouts[0].firstBoxerRecord).toEqual({
                                draw: jasmine.any(Number),
                                loss: jasmine.any(Number),
                                win: jasmine.any(Number),
                            });
                        });

                    });

                    describe("getter firstBoxerWeight", () => {

                        it("should not return null as there should have been a weigh in", () => {
                            expect(sept282019.events[0].bouts[0].firstBoxerWeight).toEqual(jasmine.any(Number));
                        });

                    });

                    describe("getter outcomeByWayOf", () => {

                        it("should return a value as the bout has happened", () => {
                            expect(sept282019.events[0].bouts[0].outcomeByWayOf).not.toBeNull();
                        });

                    });

                    describe("getter outcome", () => {

                        it("should return a value as the bout has happened", () => {
                            expect([WinLossDraw.win, WinLossDraw.loss, WinLossDraw.draw])
                                .toContain(sept282019.events[0].bouts[0].outcome);
                        });

                    });

                });

            });

        });

        describe("future date", () => {

            describe("getter events", () => {

                describe("getter bouts", () => {

                    describe("getter firstBoxerRecord", () => {

                        it("should return the first boxer's record", () => {
                            expect(nextDate.events[0].bouts[0].firstBoxerRecord).toEqual({
                                draw: jasmine.any(Number),
                                loss: jasmine.any(Number),
                                win: jasmine.any(Number),
                            });
                        });

                    });

                    describe("getter firstBoxerWeight", () => {

                        it("should return null as there hasn't been a weigh in", () => {
                            expect(nextDate.events[0].bouts[0].firstBoxerWeight).toBeNull();
                        });

                    });

                    describe("getter outcomeByWayOf", () => {

                        it("should return null as the bout has not happened", () => {
                            expect(nextDate.events[0].bouts[0].outcomeByWayOf).toBeNull();
                        });

                    });

                    describe("getter outcome", () => {

                        it("should return `scheduled` as the bout has not happened", () => {
                            expect(nextDate.events[0].bouts[0].outcome).toBe(WinLossDraw.scheduled);
                        });

                    });

                });

            });

        });

    });

    describe("method getPeopleByName", () => {

        let results: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>;
        let nextResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>;

        beforeAll(async () => {
            results = await Boxrec.getPeopleByName(loggedInCookie, "Floyd", "Mayweather");
            nextResults = await Boxrec.getPeopleByName(loggedInCookie, "Floyd", "Mayweather",
                BoxrecRole.proBoxer, BoxrecStatus.all, 20);
        });

        it("should return Floyd Sr. and then Floyd Jr.", async () => {
            let boxer: IteratorResult<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await results.next();
            expect(boxer.value.globalId).toEqual(15480);
            boxer = await results.next();
            expect(boxer.value.globalId).toEqual(352);
        });

        it("should return different results if `offset` is used", async () => {
            const boxer: IteratorResult<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await nextResults.next();
            // we expect only one page when searching Floyd Mayweather
            expect(boxer.value).toBeUndefined();
            expect(boxer.done).toBe(true);
        });

    });

    describe("method getVenueById", () => {

        let venue: BoxrecPageVenue;

        beforeAll(async () => {
            venue = await Boxrec.getVenueById(loggedInCookie, 37664);
        });

        it("should return the name of the venue", () => {
            expect(venue.name).toBe("Boardwalk Hall");
        });

        it("should return the location of the venue as an object", () => {
            expect(venue.location.region).toEqual({
                id: "NJ",
                name: "New Jersey",
            });
        });

        it("should include local boxers in an array", () => {
            expect(venue.localBoxers[0]).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

        it("should include local managers in an array", () => {
            expect(venue.localManagers[0]).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

        describe("getter events", () => {

            it("should give the dates of events", () => {
                expectMatchDate(venue.events[0].date);
            });

        });

    });

    describe("method getEventById", () => {

        const events: Map<number, BoxrecPageEvent> = new Map();
        const getEvent: (id: number) => BoxrecPageEvent =
            (id: number): BoxrecPageEvent => events.get(id) as BoxrecPageEvent;

        beforeAll(async () => {
            events.set(765205, await Boxrec.getEventById(loggedInCookie, 765205)); // Linares Lomachenko
            events.set(752960, await Boxrec.getEventById(loggedInCookie, 752960)); // Mayweather McGregor
        });

        it("should return the venue name", () => {
            expect(getEvent(765205).location.venue.name).toBe("Madison Square Garden");
        });

        it("should return a list of bouts", () => {
            expect(getEvent(765205).bouts.length).not.toBe(0);
        });

        it("should return 0 wins/loss/draw for a boxer on his debut fight", () => {
            const results: BoxrecPageEvent = getEvent(752960);
            expect(results.bouts[2].secondBoxerRecord.win).toBe(0);
            expect(results.bouts[2].secondBoxerRecord.loss).toBe(0);
            expect(results.bouts[2].secondBoxerRecord.draw).toBe(0);
        });

        it("should return a list of doctors", () => {
            expect(getEvent(752960).doctors[0].id).toBeGreaterThanOrEqual(411000);
        });

        describe("getter bout", () => {

            let bout: BoxrecPageEventBoutRow;

            beforeAll(() => {
                bout = getEvent(765205).bouts[0];
            });

            it("should return the second boxer's record", () => {
                expect(bout.secondBoxerRecord).toEqual({
                    draw: 0,
                    loss: 1,
                    win: 10,
                });
            });

            it("should return the second boxer's last 6", () => {
                expect(bout.secondBoxerLast6).toEqual(new Array(6).fill(WinLossDraw.win));
            });

        });

    });

    describe("method getEventByLocation", () => {

        let events: BoxrecPageLocationEvent;
        let nextEvents: BoxrecPageLocationEvent;

        beforeAll(async () => {
            events = await Boxrec.getEventsByLocation(loggedInCookie, {
                country: Country.USA,
                sport: BoxrecFighterOption["Pro Boxing"],
                year: 2017,
            });
            nextEvents = await Boxrec.getEventsByLocation(loggedInCookie, {
                country: Country.USA,
                sport: BoxrecFighterOption["Pro Boxing"],
                year: 2017,
            }, 20);
        });

        it("should return an array of events", async () => {
            expect(events.events.length).toBeGreaterThan(0);
        });

        it("should return the number of locations", () => {
            expect(events.numberOfLocations).toBeGreaterThanOrEqual(604);
        });

        it("should return the venue", () => {
            expect(events.events[0].venue).toEqual({
                id: 34612,
                name: "Rapides Coliseum",
            });
        });

        it("should return the location", () => {
            expect(events.events[0].location).toEqual({
                country: {
                    id: Country.USA,
                    name: "USA",
                },
                region: {
                    id: "LA",
                    name: "Louisiana",
                },
                town: {
                    id: 19077,
                    name: "Alexandria",
                }
            });
        });

        it("should return the date of the bout", () => {
            expectMatchDate(events.events[0].date);
        });

        it("should return the event id as id", () => {
            expectId(events.events[0].id, 762353);
        });

        it("should offset the results if using the `offset` param", () => {
            expect(events.events[0].id).not.toBe(nextEvents.events[0].id);
        });

        it("should return the number of pages", () => {
            expect(events.numberOfPages).toBeGreaterThan(30);
        });

    });

    describe("method getTitles", () => {

        let titleBouts: BoxrecPageTitles;

        beforeAll(async () => {
            titleBouts = await Boxrec.getTitles(loggedInCookie, {
                bout_title: 322,
                division: WeightDivisionCapitalized.welterweight,
            });
        });

        describe("getter numberOfBouts", () => {

            it("should return the number of bouts, even when less than 20", () => {
                expect(titleBouts.numberOfBouts).toBeGreaterThan(12);
            });

        });

        describe("getter bouts", () => {

            let firstBout: BoxrecPageTitlesRow;

            beforeAll(() => {
                firstBout = titleBouts.bouts[0];
            });

            it("should include the date", () => {
                expect(firstBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
            });

            it("should include the rounds", () => {
                expect(firstBout.numberOfRounds).toEqual([
                    jasmine.any(Number),
                    jasmine.any(Number),
                ]);
            });

        });

    });

    describe("method watch", () => {

        it("should add the boxer to the list", async () => {
            const response: boolean = await Boxrec.watch(loggedInCookie, 447121); // Terence Crawford
            expect(response).toBe(true);
        });

    });

    describe("method getWatched", () => {

        it("should include watched boxers", async () => {
            const response: BoxrecPageWatchRow[] = await Boxrec.getWatched(loggedInCookie);
            const boxer: BoxrecPageWatchRow | undefined = response.find(item => item.globalId === 447121);
            expect(boxer).toBeDefined();
        });

    });

    describe("method unwatch", () => {

        it("should remove the boxer from the list", async () => {
            const response: boolean = await Boxrec.unwatch(loggedInCookie, 447121); // Terence Crawford
            expect(response).toBe(true);
        });

    });

});
