import {BoxrecBasic, BoxrecFighterOption, BoxrecRole} from "boxrec-requests/dist/boxrec-requests.constants";
import {CookieJar} from "request";
import {WinLossDraw} from "./boxrec-pages/boxrec.constants";
import {WeightDivision} from "./boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageEventBout} from "./boxrec-pages/event/bout/boxrec.page.event.bout";
import {BoxingBoutOutcome} from "./boxrec-pages/event/boxrec.event.constants";
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
import {BoxrecPageTitleRow} from "./boxrec-pages/title/boxrec.page.title.row";
import {WeightDivisionCapitalized} from "./boxrec-pages/titles/boxrec.page.title.constants";
import {BoxrecPageTitles} from "./boxrec-pages/titles/boxrec.page.titles";
import {BoxrecPageTitlesRow} from "./boxrec-pages/titles/boxrec.page.titles.row";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";
import {BoxrecPageWatchRow} from "./boxrec-pages/watch/boxrec.page.watch.row";
import {Boxrec} from "./boxrec.class";

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

const expectId: (id: number | null, expectedId: any) => void = (id: number | null, expectedId: any) =>
    expect(id).toEqual(expectedId);

const expectMatchDate: (date: string | null) => void = (date: string | null) =>
    expect(date).toMatch(/\d{4}-\d{2}-\d{2}/);

describe("class Boxrec (E2E)", () => {

    let loggedInCookie: CookieJar;

    beforeAll(async () => {
        loggedInCookie = await Boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
    });

    describe("method getBoutById", () => {

        let caneloKhanBout: BoxrecPageEventBout;

        beforeAll(async () => {
            caneloKhanBout = await Boxrec.getBoutById(loggedInCookie, "726555/2037455");
        });

        describe("getter rating", () => {

            it("should give the rating", () => {
                expect(caneloKhanBout.rating).toBe(100);
            });

        });

        describe("getter date", () => {

            it("should return a date", () => {
                expect(caneloKhanBout.date).toBe("2016-05-07");
            });

        });

        describe("getter location", () => {

            it("should return the venue", () => {
                const {id, name} = caneloKhanBout.location.venue;
                expect(id).toBe(246559);
                expect(name).toBe("T-Mobile Arena");
            });

            it("should return the location", () => {
                const {town, region, country} = caneloKhanBout.location.location;
                expect(town.name).toBe("Las Vegas");
                expect(region.name).toBe("Nevada");
                expect(country.id).toBe("US");

            });

        });

        describe("getter belts", () => {

            it("should return the belts for this bout", () => {
                const {id, name, supervisor} = caneloKhanBout.titles[0];
                expect(id).toBe("6/Middleweight");
                expect(name).toBe("World Boxing Council World Middleweight Title");
                if (supervisor) {
                    expect(supervisor.name).toBe("Charles Giles");
                    expectId(supervisor.id, 418474);
                } else {
                    throw new Error("Supervisor missing");
                }
            });

        });

        describe("getter referee", () => {

            // broken on BoxRec - disabled until resolved (https://github.com/boxing/boxrec/issues/171)
            xit("should give the id and name of the referee", () => {
                expect(caneloKhanBout.referee).toEqual({
                    id: 400853,
                    name: "Kenny Bayless",
                });
            });

        });

        // disabled until this is resolved by BoxRec (https://github.com/boxing/boxrec/issues/170)
        xdescribe("getter judges", () => {

            it("should include an array of judges", () => {
                expect(caneloKhanBout.judges).toEqual(jasmine.any(Array));
            });

            it("should include the scorecards", () => {
                expect(caneloKhanBout.judges[0].scorecard).toEqual([47, 48]);
            });

            it("should include the name of the judge", () => {
                expect(caneloKhanBout.judges[0].name).toBe("Adalaide Byrd");
            });

        });

        describe("getter firstBoxerRanking", () => {

            it("should return the ranking", () => {
                expect(caneloKhanBout.firstBoxerRanking).toBe(1);
            });

        });

        describe("getter secondBoxerRating", () => {

            it("should return the ranking", () => {
                expect(caneloKhanBout.secondBoxerRanking).toEqual(jasmine.any(Number));
            });

        });

        describe("getter firstBoxerPointsBefore", () => {

            it("should return the points", () => {
                expect(caneloKhanBout.firstBoxerPointsBefore).toEqual(jasmine.any(Number));
            });

        });

        describe("getter firstBoxerAge", () => {

            it("should return the age", () => {
                expect(caneloKhanBout.firstBoxerAge).toBe(25);
            });

        });

        describe("getter secondBoxerAge", () => {

            it("should return the age", () => {
                expect(caneloKhanBout.secondBoxerAge).toBe(29);
            });

        });

        describe("getter firstBoxerStance", () => {

            it("should return the stance", () => {
                expect(caneloKhanBout.firstBoxerStance).toBe("orthodox");
            });

        });

        describe("getter secondBoxerStance", () => {

            it("should return the stance", () => {
                expect(caneloKhanBout.secondBoxerStance).toBe("orthodox");
            });

        });

        describe("getter firstBoxerHeight", () => {

            it("should return the height", () => {
                expect(caneloKhanBout.firstBoxerHeight).toEqual([5, 8, 173]);
            });

        });

        describe("getter secondBoxerHeight", () => {

            it("should return the height", () => {
                expect(caneloKhanBout.secondBoxerHeight).toEqual([5, 8.5, 174]);
            });

        });

        describe("getter firstBoxerReach", () => {

            it("should return the reach", () => {
                expect(caneloKhanBout.firstBoxerReach).toEqual([70.5, 179]);
            });

        });

        describe("getter secondBoxerReach", () => {

            it("should return the reach", () => {
                expect(caneloKhanBout.secondBoxerReach).toEqual([71, 180]);
            });

        });

        describe("getter firstBoxerRecord", () => {

            it("should return record", () => {
                expect(caneloKhanBout.firstBoxerRecord).toEqual({
                    draw: 1,
                    loss: 1,
                    win: 46,
                });
            });

        });

        describe("getter secondBoxerRecord", () => {

            it("should return record", () => {
                expect(caneloKhanBout.secondBoxerRecord).toEqual({
                    draw: 0,
                    loss: 3,
                    win: 31,
                });
            });

        });

        describe("getter firstBoxerLast6", () => {

            it("should return an array of the last 6 boxer's they were in the ring with", () => {
                const [cotto, , , angulo, mayweather] = caneloKhanBout.firstBoxerLast6;
                expect(cotto.name).toBe("Miguel Cotto");
                expect(cotto.outcome).toBe(WinLossDraw.win);
                expect(cotto.outcomeByWayOf).toBe(BoxingBoutOutcome.UD);
                expect(angulo.outcomeByWayOf).toBe(BoxingBoutOutcome.TKO);
                expect(mayweather.outcome).toBe(WinLossDraw.loss);
                expect(mayweather.outcomeByWayOf).toBe(BoxingBoutOutcome.MD);
            });

        });

        describe("getter secondBoxerLast6", () => {

            it("should return an array of the last 6 boxer's they were in the ring with", () => {
                const [, , , , molina, garcia] = caneloKhanBout.secondBoxerLast6;
                expect(molina.outcomeByWayOf).toBe(BoxingBoutOutcome.RTD);
                expect(garcia.outcomeByWayOf).toBe(BoxingBoutOutcome.TKO);
            });

        });

        describe("getter promoter", () => {

            it("should return the array of promoters", () => {
                expect(caneloKhanBout.promoters[0].company).toBe("Golden Boy Promotions");
            });

        });

        describe("getter matchmaker", () => {

            it("should return the array of matchmakers", () => {
                expectId(caneloKhanBout.matchmakers[0].id, 500179);
            });

        });

        describe("getter outcome", () => {

            it("should return the outcome", () => {
                expect(caneloKhanBout.outcome.boxer.name).toBe("Saul Alvarez");
                expect(caneloKhanBout.outcome.outcomeByWayOf).toBe(BoxingBoutOutcome.KO);
            });

        });

        describe("getter doctors", () => {

            it("should return the array of doctors", () => {
                const id: number = 468696;
                const doctor: BoxrecBasic = caneloKhanBout.doctors.find(item => item.id === id) as BoxrecBasic;
                expect(doctor.id).toBe(id);
            });

        });

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
        });

        describe("where role is boxer", () => {

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
                judge = await Boxrec.getPersonById(loggedInCookie, 401615, BoxrecRole.judge) as BoxrecPageProfileOtherCommon;
            });

            it("should return the person's information", () => {
                expect(judge.name).toBe("C.J. Ross");
            });

            it("should also have bouts to parse that they were a part of", () => {
                expect(judge.bouts).toEqual(jasmine.any(Array));
            });

        });

        describe("where role is doctor", () => {

            let doctor: BoxrecPageProfileEvents;

            beforeAll(async () => {
                doctor = await Boxrec.getPersonById(loggedInCookie, 412676, BoxrecRole.doctor) as BoxrecPageProfileEvents;
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

        // note: these events will change daily, some of these tests should either use try/catches or loop through events to satisfy the test case
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

                    it("firstBoxer", () => {
                        expect(event.bouts[0].firstBoxer.id).not.toBeNull();
                    });

                    it("secondBoxer", () => {
                        // second boxer could be empty, resulting in `null` values
                        expect(event.bouts[0].secondBoxer).toBeDefined();
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

    describe("method getPeopleByLocation", () => {

        let results: BoxrecPageLocationPeople;
        let nextResults: BoxrecPageLocationPeople;

        beforeAll(async () => {
            results = await Boxrec.getPeopleByLocation(loggedInCookie, {
                country: Country.USA,
                role: BoxrecRole.proBoxer,
            });
            nextResults = await Boxrec.getPeopleByLocation(loggedInCookie, {
                country: Country.USA,
                role: BoxrecRole.proBoxer,
            }, 20);
        });

        describe("getter numberOfPeople", () => {

            it("should return the number of people", () => {
                // this was much higher at one point, over 10000.  Not sure what changed
                expect(results.numberOfPeople).toBeGreaterThanOrEqual(3803);
            });

        });

        describe("getter numberOfPages", () => {

            it("should return a number", () => {
                expect(results.numberOfPages).toBeGreaterThan(0);
            });

        });

        it("should list people by name", () => {
            expect(results.people[0].name.length).toBeGreaterThan(0);
        });

        it("should be in order from closest to farthest", () => {
            const firstPersonMiles: number = results.people[0].miles;
            const lastPersonMiles: number = results.people[results.people.length - 1].miles;
            expect(lastPersonMiles).toBeGreaterThanOrEqual(firstPersonMiles);
        });

        it("should include the person's location", () => {
            expect(results.people[0].location.country).toEqual({
                id: Country.USA,
                name: "USA",
            });
        });

        it("might omit the person's region/town if the person is '0 miles' from this location", () => {
            expect(results.people[0].miles).toBe(0);
            expect(results.people[0].location.region).toEqual({
                id: null,
                name: null,
            });
            expect(results.people[0].location.town).toEqual({
                id: null,
                name: null,
            });
        });

        it("should offset the results if using `offset` param", () => {
            expect(results.people[0].id).not.toBe(nextResults.people[0].id);
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

    describe("method getChampions", () => {

        describe("object champions", () => {

            let results: BoxrecPageChampions;

            beforeAll(async () => {
                results = await Boxrec.getChampions(loggedInCookie);
            });

            it("should return an array of champions by weight class", () => {
                expect(results.champions[0].weightDivision).toBe(WeightDivision.heavyweight);
            });

            it("should return the ABC belts", () => {
                expect(results.champions[0].beltHolders.IBF).toBeDefined();
            });

        });

    });

    describe("method getTitleById", () => {

        const WBCMiddleweightEndpoint: string = "6/Middleweight";
        let WBCMiddleweightResult: BoxrecPageTitle;

        beforeAll(async () => {
            WBCMiddleweightResult = await Boxrec.getTitleById(loggedInCookie, WBCMiddleweightEndpoint);
        });

        describe("getter name", () => {

            it("should return the name of the title", () => {
                expect(WBCMiddleweightResult.name).toBe("World Boxing Council World Middleweight Title");
            });

        });

        describe("getter champion", () => {

            it("should return the name and id of current champion", () => {
                expect(WBCMiddleweightResult.champion).toEqual({
                    id: jasmine.any(Number),
                    name: jasmine.any(String),
                });
            });

        });

        describe("getter numberOfBouts", () => {

            it("should return the number of bouts that have occurred for this title", () => {
                expect(WBCMiddleweightResult.numberOfBouts).toBeGreaterThanOrEqual(117);
            });

        });

        describe("getter bouts", () => {

            it("should return an array of bouts that occurred for this title", () => {
                expect(WBCMiddleweightResult.bouts).toEqual(jasmine.any(Array));
            });

            describe("bout values", () => {

                let mostRecentWBCBout: BoxrecPageTitleRow;

                beforeAll(() => {
                    mostRecentWBCBout = WBCMiddleweightResult.bouts[0];
                });

                it("should include the date", () => {
                    expectMatchDate(mostRecentWBCBout.date);
                });

                it("should include the name and id of the first boxer", () => {
                    expect(mostRecentWBCBout.firstBoxer.id).not.toBeNull();
                    expect(mostRecentWBCBout.firstBoxer.name).not.toBeNull();
                });

                it("should include the name and id of the second boxer", () => {
                    expect(mostRecentWBCBout.secondBoxer.id).not.toBeNull();
                    expect(mostRecentWBCBout.secondBoxer.name).not.toBeNull();
                });

                it("should include the number of rounds", () => {
                    expect(mostRecentWBCBout.numberOfRounds[0]).toBeGreaterThan(0);
                    expect(mostRecentWBCBout.numberOfRounds[1]).toBeGreaterThan(0);
                });

            });

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
            const find: BoxrecPageWatchRow | undefined = response.find(item => item.globalId === 447121);
            expect(find).toBeDefined();
        });

    });

    describe("method unwatch", () => {

        it("should remove the boxer from the list", async () => {
            const response: boolean = await Boxrec.unwatch(loggedInCookie, 447121); // Terence Crawford
            expect(response).toBe(true);
        });

    });

});
