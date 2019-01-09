import * as fs from "fs";
import * as rp from "request-promise";
import {Cookie} from "tough-cookie";
import {boxRecMocksModulePath} from "./boxrec-pages/boxrec.constants";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";
import {BoxrecPageProfileOtherCommon} from "./boxrec-pages/profile/boxrec.page.profile.other.common";
import {BoxrecRole, BoxrecStatus} from "./boxrec-pages/search/boxrec.search.constants";
import {WeightDivisionCapitalized} from "./boxrec-pages/titles/boxrec.page.title.constants";
import boxrec from "./boxrec.class";
import Mock = jest.Mock;
import SpyInstance = jest.SpyInstance;

const mockProfileBoxerRJJ: string = fs.readFileSync(
    `${boxRecMocksModulePath}/profile/mockProfileBoxerRJJ.html`, "utf8");
const mockProfileJudgeDaveMoretti: string = fs.readFileSync(
    `${boxRecMocksModulePath}/profile/mockProfileJudgeDaveMoretti.html`, "utf8");

jest.mock("request-promise");

export const getLastCall: (spy: SpyInstance, type?: any) => any =
    (spy: SpyInstance, type: any = "uri") => spy.mock.calls[spy.mock.calls.length - 1][0][type];
const compareObjects: any = (obj: any, objToCompareTo: any) => expect(obj).toEqual(objToCompareTo);
// for testing the file writing of `getBoxerPDF` and `getBoxerPrint`
const testFileWrite: any =
    async (method: "getBoxerPDF" | "getBoxerPrint", pathToSaveTo: string, fileName: string, pathFileName: string) => {
        const spyStream: Mock<any> = jest.spyOn(fs, "createWriteStream").mockReturnValueOnce("test");
        await boxrec[method](555, pathToSaveTo, fileName);
        return expect(spyStream).toHaveBeenCalledWith(pathFileName);
    };

describe("class Boxrec", () => {

    afterAll(async () => {
        const spy: SpyInstance = jest.spyOn(rp, "jar");
        spy.mockReturnValueOnce({
            getCookies: () => [
                {
                    key: "PHPSESSID",
                },
                {
                    key: "REMEMBERME",
                }
            ],
            setCookie: () => {
                //
            }
        });
        await boxrec.login("", "");
    });

    describe("getting PHPSESSID", () => {

        it("should make a GET request to http://boxrec.com to get the PHPSESSID", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.login("", "");
            expect(spy.mock.calls[0][0].uri).toBe("http://boxrec.com");
        });

        it("should throw if it could not get the initial PHPSESSID", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce(Promise.resolve({headers: {"set-cookie": []}}));
            await expect(boxrec.login("", "")).rejects.toThrowError("Could not get cookie from initial request to boxrec");
        });

        it("should throw if the HTTP status code is an error code", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce(Promise.reject({headers: {"set-cookie": "works"}}));
            await expect(boxrec.login("", "")).rejects.toThrowError("Could not get response from boxrec");
        });

    });

    describe("logging in", () => {

        interface MiniReponse {
            request: any;
        }

        const emptyUriPathName: MiniReponse | Partial<Response> = {
            request: {
                uri: {
                    pathname: "",
                },
            },
        };

        // creates a spy with only 1 of 2 required keys and then sets the expect condition
        const cookieTest: any = async (key: "REMEMBERME" | "PHPSESSID"): Promise<any> => {
            const spy: SpyInstance = jest.spyOn(rp, "jar");
            spy.mockReturnValueOnce({
                getCookies: () => [
                    {
                        key,
                    },
                ],
                setCookie: () => {
                    //
                }
            });

            await expect(boxrec.login("", "")).rejects.toThrowError("Cookie did not have PHPSESSID and REMEMBERME");
        };

        it("should make a POST request to http://boxrec.com/en/login", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "post");
            await boxrec.login("", "");
            expect(spy.mock.calls[0][0].url).toBe("http://boxrec.com/en/login");
        });

        it("should throw if boxrec returns that the username does not exist", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "post");
            spy.mockReturnValueOnce(Promise.resolve(Object.assign({body: "<div>username does not exist</div>"}, emptyUriPathName))); // resolve because 200 response
            await expect(boxrec.login("", "")).rejects.toThrowError("Username does not exist");
        });

        it("should throw an error if GDPR consent has not been given to BoxRec", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "post");
            spy.mockReturnValueOnce(Promise.resolve(Object.assign({body: "<div>GDPR</div>"}, emptyUriPathName)));
            await expect(boxrec.login("", "")).rejects.toThrowError("GDPR consent is needed with this account.  Log into BoxRec through their website and accept before using this account");
        });

        it("should throw if boxrec returns that the password is not correct", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "post");
            spy.mockReturnValueOnce(Promise.resolve(Object.assign({body: "<div>your password is incorrect</div>"}, emptyUriPathName))); // resolve because 200 response
            await expect(boxrec.login("", "")).rejects.toThrowError("Your password is incorrect");
        });

        it("should return undefined if it was a success", async () => {
            const response: Error | void = await boxrec.login("", "");
            expect(response).toBeUndefined();
        });

        it("should throw if after successfully logging in the cookie does not include PHPSESSID", async () => {
            await cookieTest("REMEMBERME");
        });

        it("should throw if after successfully logging in the cookie does not include REMEMBERME", async () => {
            await cookieTest("PHPSESSID");
        });
    });

    describe("getter cookie", () => {

        it("should return a string with PHPSESSID and REMEMBERME if logged in", () => {
            const cookie: Cookie[] = boxrec.cookies;
            expect(cookie[0].key === "PHPSESSID");
            expect(cookie[1].key === "REMEMBERME");
        });

    });

    describe("method getRatings", () => {

        it("should make a GET request to http://boxrec.com/en/ratings", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getRatings({
                sex: "M",
            });
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/ratings");
        });

    });

    describe("method getPersonById", () => {

        it("should make a GET request to http://boxrec.com/en/boxer/{globalId}", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce(Promise.resolve(mockProfileBoxerRJJ));
            await boxrec.getPersonById(555);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/boxer/555");
        });

        it("should make a GET request to a `judge` endpoint if the role is provided", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce(Promise.resolve(mockProfileJudgeDaveMoretti));
            await boxrec.getPersonById(1, BoxrecRole.judge);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/judge/1");
        });

        it("supplying an `offset` value will append this to the URL", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce(Promise.resolve(mockProfileJudgeDaveMoretti));
            await boxrec.getPersonById(1, BoxrecRole.judge, 20);
            expect(getLastCall(spy, "qs")).toEqual({
                offset: 20,
            });
        });

    });

    describe("method getEventById", () => {

        it("should make a GET request to http://boxrec.com/en/event/${eventId}", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getEventById(555);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/event/555");
        });

    });

    describe("method getBoutById", () => {

        it("should make a GET request to http://boxrec.com/en/event (with bout)", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getBoutById("771321/2257534");
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/event/771321/2257534");
        });

    });

    describe("method getPeopleByName", () => {

        it("should return a generator of boxers it found", async () => {
            const searchResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await boxrec.getPeopleByName("test", "test");
            expect(searchResults.next()).toBeDefined();
        });

        it("should make a call to boxrec every time the generator next method is called", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValue(Promise.resolve(mockProfileBoxerRJJ));
            const getSpy: SpyInstance = jest.spyOn(boxrec, "getPersonById");
            jest.spyOn(boxrec, "search").mockReturnValueOnce([{id: 999}, {id: 888}]);
            const searchResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await boxrec.getPeopleByName("test", "test");
            expect(getSpy).toHaveBeenCalledTimes(0);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(1);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(2);
        });

    });

    describe("method getResults", () => {

        it("should make a GET request to http://boxrec.com/en/results", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getResults({});
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/results");
        });

    });

    describe("method getSchedule", () => {

        it("should make a GET request to http://boxrec.com/en/schedule", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getSchedule({});
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/schedule");
        });

    });

    describe("method getPeopleByLocation", () => {

        it("should make a GET request to http://boxrec.com/en/locations/people", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getPeopleByLocation({
                role: BoxrecRole.boxer,
            });
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/locations/people");
        });

    });

    describe("method getEventsByLocation", () => {

        it("should make a GET request to http://boxrec.com/en/locations/event", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getEventsByLocation({});
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/locations/event");
        });

    });

    describe("method getTitleById", () => {

        it("should make a GET request to http://boxrec.cox/en/title/${title}", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getTitleById("6/Middleweight");
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/title/6/Middleweight");
        });

    });

    describe("method getVenueById", () => {

        it("should make a GET request to http://boxrec.com/en/venue/555", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getVenueById(555);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/venue/555");
        });

    });

    describe("method search", () => {

        beforeAll(() => {
            Object.defineProperty(boxrec, "searchParamWrap", {
                configurable: true,
                get: jest.fn(() => "abc"),
            });
        });

        it("should make a GET request to http://boxrec.com/en/search", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.search({
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.judge,
                status: BoxrecStatus.all,
            });

            expect(getLastCall(spy)).toBe("http://boxrec.com/en/search");
        });

        it("should not send any keys that aren't wrapped in []", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.search({
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.boxer,
                status: BoxrecStatus.all,
            });
            expect(getLastCall(spy, "qs").first_name).not.toBeDefined();
        });

    });

    describe("method getChampions", () => {

        it("should make a GET request to http://boxrec.com/en/champions", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getChampions();
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/champions");
        });

    });

    describe("method getBoxerPDF", () => {

        let spy: Mock<any>;

        beforeEach(() => {
            spy = jest.spyOn(rp, "get").mockReturnValueOnce({
                pipe: (a: string) => {
                    //
                },
            });
        });

        it("should make a GET request with query string that contains `pdf`", async () => {
            await boxrec.getBoxerPDF(555);
            compareObjects(spy.mock.calls[spy.mock.calls.length - 1][0].qs, {
                pdf: "y",
            });
        });

        it("should not save to the directory it is called from if no path supplied", async () => {
            const spyStream: Mock<any> = jest.spyOn(fs, "createWriteStream").mockReturnValueOnce("test2");
            await boxrec.getBoxerPDF(555);
            return expect(spyStream).not.toHaveBeenCalled();
        });

        it("should append a `/` to the path if one was not supplied", async () => {
            testFileWrite("getBoxerPDF", "./foo", "bar.pdf", "./foo/bar.pdf");
        });

        it("should use the globalId of the boxer if no file name is supplied", async () => {
            testFileWrite("getBoxerPDF", "./foo", null, "./foo/555.pdf");
        });

    });

    describe("method getBoxerPrint", () => {

        let spy: Mock<any>;

        beforeEach(() => {
            spy = jest.spyOn(rp, "get").mockReturnValueOnce({
                pipe: () => {
                    //
                },
            });
        });

        it("should make a GET request with query string that contains `print`", async () => {
            await boxrec.getBoxerPrint(555);
            compareObjects(spy.mock.calls[spy.mock.calls.length - 1][0].qs, {
                print: "y",
            });
        });

        it("should save the file with `.html` file type", async () => {
            testFileWrite("getBoxerPrint", "./foo", null, "./foo/555.html");
        });

    });

});
