import {Boxrec} from "./boxrec.class";
import {WeightClass} from "./boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecRole} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecPageLocationPeople} from "./boxrec-pages/location/boxrec.page.location.people";
import {BoxrecPageProfile} from "./boxrec-pages/profile/boxrec.page.profile";
import {Country} from "./boxrec-pages/location/boxrec.location.constants";

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

describe("class Boxrec (E2E)", () => {

    describe("method login", () => {

        it("should return nothing if was successful", async () => {
            const response: Error | void = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
            expect(response).toBeUndefined();
        });

    });

    describe("method getPersonById", () => {

        let boxers: Map<number, BoxrecPageProfile> = new Map();
        const getBoxer: Function = (id: number): BoxrecPageProfile | undefined => boxers.get(id);

        beforeAll(async () => {
            await boxers.set(352, await boxrec.getPersonById(352)); // Floyd Mayweather Jr.
            await boxers.set(9625, await boxrec.getPersonById(9625)); // Sugar Ray Robinson
        });

        describe("where role is boxer", () => {

            it("should return the person's information", () => {
                expect(getBoxer(352).name).toBe("Floyd Mayweather Jr");
            });

            it("should include the person's alias", () => {
                expect(getBoxer(352).alias).toBe("Money, Pretty Boy");
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

            let judge: BoxrecPageProfile;

            beforeAll(async () => {
                judge = await boxrec.getPersonById(401615, BoxrecRole.judge);
            });

            it("should return the person's information", () => {
                expect(judge.name).toBe("C.J. Ross");
            });

            it("should return an empty array for bouts", () => {
                expect(judge.bouts).toEqual([]);
            });

        });

    });

    describe("method getPeopleByName", () => {

        it("should return Floyd Sr. and then Floyd Jr.", async () => {
            const results: AsyncIterableIterator<BoxrecPageProfile> = await boxrec.getPeopleByName("Floyd", "Mayweather");
            let boxer: IteratorResult<BoxrecPageProfile> = await results.next();
            expect(boxer.value.birthName).toContain("Floyd");
            boxer = await results.next();
            expect(boxer.value.birthName).toContain("Floyd");
        });

    });

    describe("method getPeopleByLocation", () => {

        let results: BoxrecPageLocationPeople;

        beforeAll(async () => {
            results = await boxrec.getPeopleByLocation({
                country: Country.USA,
                role: BoxrecRole.boxer,
            });
        });

        it("should list people by name", () => {
            expect(results.output[0].name.length).toBeGreaterThan(0);
        });

        it("should be in order from closest to farthest", () => {
            const firstPersonMiles: number = results.output[0].miles;
            const lastPersonMiles: number = results.output[results.output.length - 1].miles;
            expect(lastPersonMiles).toBeGreaterThanOrEqual(firstPersonMiles);
        });

        it("should include the person's location", () => {
            expect(results.output[0].location.country).toBe(Country.USA);
        });

        it("might omit the person's region/town if the person is '0 miles' from this location", () => {
            expect(results.output[0].miles).toBe(0);
            expect(results.output[0].location.region).toBeNull();
            expect(results.output[0].location.town).toBeNull();
        });

    });

    describe("method getEventById", () => {

        let events: Map<number, BoxrecPageEvent> = new Map();
        const getEvent: Function = (id: number): BoxrecPageEvent => {


            console.log(events.size);

            return events.get(id) as BoxrecPageEvent;
        };

        beforeAll(async () => {
            await events.set(765205, await boxrec.getEventById(765205)); // Linares Lomachenko
            await events.set(752960, await boxrec.getEventById(752960)); // Linares Lomachenko
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

    describe("method getChampions", () => {

        describe("object champions", () => {

            let results: BoxrecPageChampions;

            beforeAll(async () => {
                results = await boxrec.getChampions();
            });

            it("should return an array of champions by weight class", () => {
                expect(results.champions[0].weightClass).toBe(WeightClass.heavyweight);
            });

            it("should return the ABC belts", () => {
                expect(results.champions[0].beltHolders.IBF).toBeDefined();
            });

        });

    });

});
