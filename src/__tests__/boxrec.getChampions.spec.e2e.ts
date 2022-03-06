import {CookieJar} from "request";
import {WeightDivision} from "../boxrec-pages/champions/boxrec.champions.constants";
import {BoxrecPageChampions} from "../boxrec-pages/champions/boxrec.page.champions";
import {Boxrec} from "../boxrec.class";
import {logIn, wait} from "./helpers";

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

jest.setTimeout(200000);

// todo skipping as the champions page as changed dramatically
describe.skip("method getChampions", () => {

    describe("object champions", () => {

        let loggedInCookie: CookieJar;

        beforeAll(async () => {
            const logInResponse: { madeRequest: boolean, cookieJar: CookieJar} = await logIn();
            loggedInCookie = logInResponse.cookieJar;
        });

        let results: BoxrecPageChampions;

        beforeAll(async () => {
            results = await Boxrec.getChampions(loggedInCookie);
            await wait();
        });

        it("should return an array of champions by weight class", () => {
            expect(results.champions[0].weightDivision).toBe(WeightDivision.heavyweight);
        });

        it("should return the ABC belts", () => {
            expect(results.champions[0].beltHolders.IBF).toBeDefined();
        });

    });

});
