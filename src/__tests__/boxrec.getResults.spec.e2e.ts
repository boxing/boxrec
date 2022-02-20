import {CookieJar} from "request";
import {BoxrecPageSchedule} from "../boxrec-pages/schedule/boxrec.page.schedule";
import {Boxrec} from "../boxrec.class";
import {logIn, wait} from "./helpers";
import DoneCallback = jest.DoneCallback;

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

jest.setTimeout(30000);

describe("method getResults", () => {

    let loggedInCookie: CookieJar;

    beforeAll(async (done: DoneCallback) => {
        const logInResponse: { madeRequest: boolean, cookieJar: CookieJar} = await logIn();
        loggedInCookie = logInResponse.cookieJar;

        if (logInResponse.madeRequest) {
            wait(done);
        } else {
            done();
        }
    });

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
