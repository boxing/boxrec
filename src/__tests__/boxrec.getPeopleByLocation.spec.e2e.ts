import {BoxrecRole} from "boxrec-requests";
import {Country} from "boxrec-requests";
import {CookieJar} from "request";
import {BoxrecPageLocationPeople} from "../boxrec-pages/location/people/boxrec.page.location.people";
import {Boxrec} from "../boxrec.class";
import {logIn, wait} from "./helpers";

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

jest.setTimeout(200000);

describe("method getPeopleByLocation", () => {

    let loggedInCookie: CookieJar;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieJar: CookieJar} = await logIn();
        loggedInCookie = logInResponse.cookieJar;
    });

    let results: BoxrecPageLocationPeople;
    let nextResults: BoxrecPageLocationPeople;

    beforeAll(async () => {
        results = await Boxrec.getPeopleByLocation(loggedInCookie, {
            country: Country.USA,
            role: BoxrecRole.proBoxer,
        });
        await wait();
        nextResults = await Boxrec.getPeopleByLocation(loggedInCookie, {
            country: Country.USA,
            role: BoxrecRole.proBoxer,
        }, 20);
        await wait();
    });

    describe("getter numberOfPeople", () => {

        it("should return the number of people", () => {
            // this was much higher at one point, over 10000.  Not sure what changed
            expect(results.numberOfPeople).toBeGreaterThanOrEqual(100);
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
        // todo this doesn't work properly
        expect(results.people[0].id).not.toBe(nextResults.people[0].id);
    });

});
