import {CookieJar} from "request";
import {WeightDivision} from "../boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecPageChampions} from "../boxrec-pages/champions/boxrec.page.champions";
import {Boxrec} from "../boxrec.class";
import {logIn, wait} from "./helpers";
import DoneCallback = jest.DoneCallback;

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

jest.setTimeout(30000);

describe("method getChampions", () => {

    describe("object champions", () => {

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
