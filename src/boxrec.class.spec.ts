import {Boxrec} from "./boxrec.class";
import {BoxrecRole, BoxrecStatus} from "./boxrec-pages/search/boxrec.search.constants";
import {Response} from "request";
import {BoxrecPageProfile} from "./boxrec-pages/profile/boxrec.page.profile";
import SpyInstance = jest.SpyInstance;

const boxrec: Boxrec = require("./boxrec.class");

jest.mock("request-promise");
const rp: any = require("request-promise");

export const getLastCall: Function = (spy: any, type = "uri") => spy.mock.calls[spy.mock.calls.length - 1][0][type];

describe("class boxrec", () => {

    describe("method login", () => {

        afterAll(async () => {
            const spy: SpyInstance = jest.spyOn(rp, "jar");
            spy.mockReturnValueOnce({
                getCookieString: () => {
                    return "PHPSESSID=111; REMEMBERME=111";
                },
                setCookie: () => {
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

            // todo should be done better
            const emptyUriPathName: MiniReponse | Partial<Response> = {
                request: {
                    uri: {
                        pathname: "",
                    },
                },
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
                const spy: SpyInstance = jest.spyOn(rp, "jar");
                spy.mockReturnValueOnce({
                    getCookieString: () => {
                        return "REMEMBERME=123";
                    },
                    setCookie: () => {
                    }
                });
                await expect(boxrec.login("", "")).rejects.toThrowError("Cookie did not have PHPSESSID and REMEMBERME");
            });

            it("should throw if after successfully logging in the cookie does not include REMEMBERME", async () => {
                const spy: SpyInstance = jest.spyOn(rp, "jar");
                spy.mockReturnValueOnce({
                    getCookieString: () => {
                        return "PHPSESSID=111";
                    },
                    setCookie: () => {
                    }
                });
                await expect(boxrec.login("", "")).rejects.toThrowError("Cookie did not have PHPSESSID and REMEMBERME");
            });

        });

    });

    describe("method getRatings", () => {

        it("should make a GET request to http://boxrec.com/en/ratings", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getRatings();
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/ratings");
        });

        it("should clone any keys in the object and wrap with `r[]`", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getRatings({
                division: "bar"
            });
            expect(getLastCall(spy, "qs")).toEqual({"r[division]": "bar"});
        });

    });

    describe("method getPersonById", () => {

        it("should make a GET request to http://boxrec.com/en/boxer/{globalId}", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce({});
            await boxrec.getPersonById(555);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/boxer/555");
        });

        it("should make a GET request to a `judge` endpoint if the role is provided", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValueOnce({});
            await boxrec.getPersonById(1, BoxrecRole.judge);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/judge/1");
        });

    });

    describe("method getEventById", () => {

        it("should make a GET request to http://boxrec.com/en/event/${eventId}", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.getEventById(555);
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/event/555");
        });

    });

    describe("method getPeopleByName", () => {

        it("should return a generator of boxers it found", async () => {
            const searchResults: AsyncIterableIterator<BoxrecPageProfile> = await boxrec.getPeopleByName("test", "test");
            expect(searchResults.next()).toBeDefined();
        });

        it("should make a call to boxrec everytime the generator next method is called", async () => {
            const getSpy: SpyInstance = jest.spyOn(boxrec, "getPersonById");
            jest.spyOn(boxrec, "search").mockReturnValueOnce([{id: 999}, {id: 888}]);
            const searchResults: AsyncIterableIterator<BoxrecPageProfile> = await boxrec.getPeopleByName("test", "test");
            expect(getSpy).toHaveBeenCalledTimes(0);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(1);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(2);
        });

    });

    describe("method search", () => {

        it("should make a GET request to http://boxrec.com/en/search", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.search({
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.boxer,
                status: BoxrecStatus.all,
            });
            expect(getLastCall(spy)).toBe("http://boxrec.com/en/search");
        });

        it("should clone any keys in the object and wrap with `pf[]`", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.search({
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.boxer,
                status: BoxrecStatus.all,
            });
            expect(getLastCall(spy, "qs")["pf[first_name]"]).toBe("bla");
        });

        it("should send role=boxer because that's all we can currently support", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await boxrec.search({
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.boxer,
                status: BoxrecStatus.all,
            });
            expect(getLastCall(spy, "qs")["pf[role]"]).toBe("boxer");
        });

        it("should not send any keys that aren't wrapped in pf[]", async () => {
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

});
