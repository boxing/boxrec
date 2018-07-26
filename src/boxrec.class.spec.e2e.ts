import {Boxrec} from "./boxrec.class";
import {WeightDivision} from "./boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecRole, BoxrecStatus} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecPageLocationPeople} from "./boxrec-pages/location/people/boxrec.page.location.people";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {Country} from "./boxrec-pages/location/people/boxrec.location.people.constants";
import {BoxrecPageLocationEvent} from "./boxrec-pages/location/event/boxrec.page.location.event";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";
import {BoxrecPageSchedule} from "./boxrec-pages/schedule/boxrec.page.schedule";
import {BoxrecPageTitle} from "./boxrec-pages/title/boxrec.page.title";
import {BoxrecPageTitleRow} from "./boxrec-pages/title/boxrec.page.title.row";
import {BoxrecPageProfileJudgeSupervisor} from "./boxrec-pages/profile/boxrec.page.profile.judgeSupervisor";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";

export const boxrec: Boxrec = require("./boxrec.class.ts");
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

describe("class Boxrec (E2E)", () => {

    describe("method login", () => {

        it("should return nothing if was successful", async () => {
            const response: Error | void = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
            expect(response).toBeUndefined();
        });

    });

    beforeAll(async () => {
        const response: Error | void = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
        expect(response).toBeUndefined();
    });

    describe("method getPersonById", () => {

        const boxers: Map<number, BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager> = new Map();
        const getBoxer: Function = (id: number): BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager | undefined => boxers.get(id);

        beforeAll(async () => {
            await boxers.set(352, await boxrec.getPersonById(352)); // Floyd Mayweather Jr.
            await boxers.set(9625, await boxrec.getPersonById(9625)); // Sugar Ray Robinson
        });

        describe("where role is boxer", () => {

            it("should return the person's information", () => {
                expect(getBoxer(352).name).toBe("Floyd Mayweather Jr");
            });

            it("should include the person's alias", () => {
                expect(getBoxer(352).alias).toBe("Money / Pretty Boy");
            });

            it("should include the number of bouts they were in", () => {
                expect(getBoxer(9625).bouts.length).toBe(201);
            });

            it("should return if they are suspended or not", () => {
                expect(getBoxer(352).suspended).toBe(null);
            });

            describe("bouts", () => {

                it("should return an array of bouts", () => {
                    expect(getBoxer(352).bouts.length).toBeGreaterThanOrEqual(49);
                });

                it("should return the opponent's name", () => {
                    expect(getBoxer(352).bouts[49].secondBoxer.name).toBe("Conor McGregor");
                });

                describe("venue", () => {

                    it("should return the venue name", () => {
                        expect(getBoxer(352).bouts[49].location.venue).toBe("T-Mobile Arena");
                    });

                    it("should return the venue location", () => {
                        expect(getBoxer(352).bouts[49].location.town).toBe("Las Vegas");
                    });

                });

                describe("hasBoxerRatings", () => {

                    it("should always return true because it'll make another call if all the columns aren't there", () => {
                        expect(getBoxer(352).bouts[49].hasBoxerRatings).toBe(true);
                    });

                });

                describe("firstBoxerRating", () => {

                    it("should return the boxer rating before and after the bout", () => {
                        expect(getBoxer(352).bouts[49].firstBoxerRating).toEqual([596, 596]);
                    });

                    it("should strip all commas from the rating", () => {
                        expect(getBoxer(352).bouts[47].firstBoxerRating).toEqual([1582, 1904]);
                    });

                });

                describe("secondBoxerRating", () => {

                    it("should return the boxer rating before and after the bout", () => {
                        expect(getBoxer(352).bouts[49].secondBoxerRating).toEqual([0, 0]);
                    });

                    it("should strip all commas from the rating", () => {
                        expect(getBoxer(352).bouts[47].secondBoxerRating).toEqual([jasmine.any(Number), jasmine.any(Number)]);
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

            let judge: BoxrecPageProfileJudgeSupervisor;

            beforeAll(async () => {
                judge = await boxrec.getPersonById(401615, BoxrecRole.judge) as BoxrecPageProfileJudgeSupervisor;
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
                doctor = await boxrec.getPersonById(412676, BoxrecRole.doctor) as BoxrecPageProfileEvents;
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

            let promoter: BoxrecPageProfileEvents;

            beforeAll(async () => {
                promoter = await boxrec.getPersonById(419406, BoxrecRole.promoter) as BoxrecPageProfileEvents;
            });

            it("should return the company name", () => {
                expect(promoter.company).toBe("Mayweather Promotions");
            });

        });

    });

    describe("method getSchedule", () => {

        let results: BoxrecPageSchedule;
        let nextResults: BoxrecPageSchedule;

        beforeAll(async () => {
            results = await boxrec.getSchedule({});
            // note: replace the following if have a reason to grab different schedule data
            nextResults = await boxrec.getSchedule({}, 20);
        });

        it("should give an array of schedule events", () => {
            expect(results.events.length).toBeGreaterThanOrEqual(0);
        });

        it("should use the `offset` to give the next results", async () => {
            expect(results.events[0].id).not.toEqual(nextResults.events[0].id);
        });

        // note: these events will change daily, some of these tests should either use try/catches or loop through events to satisfy the test case
        describe("getter events", () => {

            let event: BoxrecPageEvent;

            beforeAll(() => {
                event = results.events[0];
            });

            describe("getter date", () => {

                it("should include the date of an event", () => {
                    expect(event.date).toMatch(/\d{4}-\d{2}-\d{2}/);
                });

            });

            describe("getter location", () => {

                describe("venue", () => {

                    it("should include the id of the venue", () => {
                        expect(event.location.venue.id).toEqual(jasmine.any(Number));
                    });

                    it("should include the name of the venue", () => {
                        expect(event.location.venue.name).toEqual(jasmine.any(String));
                    });

                });

                describe("location", () => {

                    it("should include the id of the location", () => {
                        expect(event.location.location.id).toEqual(jasmine.any(Number));
                    });

                    it("should include the town", () => {
                        expect(event.location.location.town).toEqual(jasmine.any(String));
                    });

                    it("should include the country", () => {
                        expect(event.location.location.country).toEqual(jasmine.any(String));
                    });

                    it("should include the region", () => {
                        // it can be null
                        expect(event.location.location.region).not.toBeUndefined();
                    });

                });

            });

            describe("getter promoter", () => {

                it("should include the promotional company in an array", () => {
                    expect(event.promoter).not.toBeUndefined();
                    expect(event.promoter.length).toBeGreaterThanOrEqual(0);
                });

            });

            describe("getter matchmaker", () => {

                it("should be included if it exists", () => {
                    expect(event.matchmaker).not.toBeUndefined();
                });

            });

            describe("getter doctor", () => {

                it("should include an array of doctors", () => {
                    expect(event.doctor).not.toBeUndefined();
                    expect(event.doctor.length).toBeGreaterThanOrEqual(0);
                });

            });

            describe("getter inspector", () => {

                it("should include the id and name of the inspector", () => {
                    expect(event.inspector).not.toBeUndefined();
                });

            });

            it("should include the wiki id as id", () => {
                expect(event.id).toBeGreaterThanOrEqual(0);
            });

        });

    });

    describe("method getPeopleByName", () => {

        let results: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager>;
        let nextResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager>;

        beforeAll(async () => {
            results = await boxrec.getPeopleByName("Floyd", "Mayweather");
            nextResults = await boxrec.getPeopleByName("Floyd", "Mayweather", BoxrecRole.boxer, BoxrecStatus.all, 20);
        });

        it("should return Floyd Sr. and then Floyd Jr.", async () => {
            let boxer: IteratorResult<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await results.next();
            expect(boxer.value.globalId).toEqual(15480);
            boxer = await results.next();
            expect(boxer.value.globalId).toEqual(352);
        });

        it("should return different results if `offset` is used", async () => {
            const boxer: IteratorResult<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await nextResults.next();
            // we expect only one page when searching Floyd Mayweather
            expect(boxer.value).toBeUndefined();
            expect(boxer.done).toBe(true);
        });

    });

    describe("method getVenueById", () => {

        let venue: BoxrecPageVenue;

        beforeAll(async () => {
            venue = await boxrec.getVenueById(37664);
        });

        it("should return the name of the venue", () => {
            expect(venue.name).toBe("Boardwalk Hall");
        });

        it("should return the location of the venue as an object", () => {
            expect(venue.location.region).toBe("NJ");
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
                expect(venue.events[0].date).toMatch(/\d{4}-\d{2}-\d{2}/);
            });

        });

    });

    describe("method getPeopleByLocation", () => {

        let results: BoxrecPageLocationPeople;
        let nextResults: BoxrecPageLocationPeople;

        beforeAll(async () => {
            results = await boxrec.getPeopleByLocation({
                country: Country.USA,
                role: BoxrecRole.boxer,
            });
            nextResults = await boxrec.getPeopleByLocation({
                country: Country.USA,
                role: BoxrecRole.boxer,
            }, 20);
        });

        it("should list people by name", () => {
            expect(results.boxers[0].name.length).toBeGreaterThan(0);
        });

        it("should be in order from closest to farthest", () => {
            const firstPersonMiles: number = results.boxers[0].miles;
            const lastPersonMiles: number = results.boxers[results.boxers.length - 1].miles;
            expect(lastPersonMiles).toBeGreaterThanOrEqual(firstPersonMiles);
        });

        it("should include the person's location", () => {
            expect(results.boxers[0].location.country).toBe(Country.USA);
        });

        it("might omit the person's region/town if the person is '0 miles' from this location", () => {
            expect(results.boxers[0].miles).toBe(0);
            expect(results.boxers[0].location.region).toBeNull();
            expect(results.boxers[0].location.town).toBeNull();
        });

        it("should offset the results if using `offset` param", () => {
            expect(results.boxers[0].id).not.toBe(nextResults.boxers[0].id);
        });

    });

    describe("method getEventById", () => {

        const events: Map<number, BoxrecPageEvent> = new Map();
        const getEvent: Function = (id: number): BoxrecPageEvent => events.get(id) as BoxrecPageEvent;

        beforeAll(async () => {
            await events.set(765205, await boxrec.getEventById(765205)); // Linares Lomachenko
            await events.set(752960, await boxrec.getEventById(752960)); // Mayweather McGregor
        });

        it("should return the venue name", () => {
            expect(getEvent(765205).location.venue.name).toBe("Madison Square Garden");
        });

        it("should return a list of bouts", () => {
            expect(getEvent(765205).bouts[0].firstBoxer.name).toBe("Jorge Linares");
        });

        it("should return 0 wins/loss/draw for a boxer on his debut fight", () => {
            const results: BoxrecPageEvent = getEvent(752960);
            expect(results.bouts[2].secondBoxerRecord.win).toBe(0);
            expect(results.bouts[2].secondBoxerRecord.loss).toBe(0);
            expect(results.bouts[2].secondBoxerRecord.draw).toBe(0);
        });

    });

    describe("method getEventByLocation", () => {

        let events: BoxrecPageLocationEvent;
        let nextEvents: BoxrecPageLocationEvent;

        beforeAll(async () => {
            events = await boxrec.getEventsByLocation({
                country: Country.USA,
                year: 2017,
            });
            nextEvents = await boxrec.getEventsByLocation({
                country: Country.USA,
                year: 2017,
            }, 20);
        });

        it("should return an array of events", async () => {
            expect(events.events.length).toBeGreaterThan(0);
        });

        it("should return the venue", () => {
            expect(events.events[0].venue).toEqual({
                id: 34612,
                name: "Rapides Coliseum",
            });
        });

        it("should return the location", () => {
            expect(events.events[0].location).toEqual({
                id: 19077,
                town: "Alexandria",
                region: "LA",
                country: Country.USA,
            });
        });

        it("should return the date of the bout", () => {
            expect(events.events[0].date).toBe("2017-12-29");
        });

        it("should return the event id as id", () => {
            expect(events.events[0].id).toBe(762353);
        });

        it("should offset the results if using the `offset` param", () => {
            expect(events.events[0].id).not.toBe(nextEvents.events[0].id);
        });

    });

    describe("method getChampions", () => {

        describe("object champions", () => {

            let results: BoxrecPageChampions;

            beforeAll(async () => {
                results = await boxrec.getChampions();
            });

            it("should return an array of champions by weight class", () => {
                expect(results.champions[0].weightDivision).toBe(WeightDivision.heavyweight);
            });

            it("should return the ABC belts", () => {
                expect(results.champions[0].beltHolders.IBF).toBeDefined();
            });

        });

    });

    describe("method getTitle", () => {

        const WBCMiddleweightEndpoint: string = "6/Middleweight";
        let WBCMiddleweightResult: BoxrecPageTitle;

        beforeAll(async () => {
            WBCMiddleweightResult = await boxrec.getTitle(WBCMiddleweightEndpoint);
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
                    expect(mostRecentWBCBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
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

});
