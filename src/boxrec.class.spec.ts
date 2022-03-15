import {mockProfileBoxerRJJ} from "boxrec-mocks";
import {BoxrecRequests} from "boxrec-requests";
import {BoxrecFighterOption, BoxrecRole, Country} from "boxrec-requests";
import * as fs from "fs";
import {CookieJar} from "request";
// @ts-ignore (because it's javascript)
import * as rp from "./__mocks__/request-promise";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";
import {BoxrecPageProfileOtherCommon} from "./boxrec-pages/profile/boxrec.page.profile.other.common";
import {BoxrecStatus} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageWatch} from "./boxrec-pages/watch/boxrec.page.watch";
import {Boxrec} from "./boxrec.class";
import Mock = jest.Mock;
import SpyInstance = jest.SpyInstance;

jest.mock("request-promise");

// for testing the file writing of `getBoxerPDF` and `getBoxerPrint`
const testFileWrite: any =
    async (loggedInCookie: CookieJar, method: "getBoxerPDF" | "getBoxerPrint", pathToSaveTo: string, fileName: string, pathFileName: string) => {
        const spyStream: Mock<any> = jest.spyOn(fs, "createWriteStream").mockReturnValueOnce("test");
        await Boxrec[method](loggedInCookie, 555, pathToSaveTo, fileName);
        return expect(spyStream).toHaveBeenCalledWith(pathFileName);
    };

describe.skip("class Boxrec", () => {

    const loggedInCookie: CookieJar = rp.jar();

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
        await Boxrec.login("", "");
    });

    describe("logging in", () => {

        it("should make a POST request to https://boxrec.com/en/login", async () => {
            try {
                // this will throw because the entire method in boxrec-requests isn't mocked here
                await Boxrec.login("", "");
            } catch (e) {
                expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                    method: "POST",
                    url: "https://boxrec.com/en/login",
                }));
            }
        });

    });

    describe("method getRatings", () => {

        it("should make a GET request to https://boxrec.com/en/ratings", async () => {
            await Boxrec.getRatings(loggedInCookie, {
                sex: "M",
            });
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/ratings",
            }));
        });

    });

    describe("method getPersonById", () => {

        it("should not pass a role to boxrec-requests if none was specified", async () => {
            const spy: SpyInstance = jest.spyOn(BoxrecRequests, "getPersonById");
            spy.mockReturnValueOnce(Promise.resolve(mockProfileBoxerRJJ));
            await Boxrec.getPersonById(loggedInCookie, 555);
            expect(spy).toHaveBeenCalledWith(loggedInCookie, 555, null, 0);
        });

        it("should pass `judge` as role if role is provided", async () => {
            const spy: SpyInstance = jest.spyOn(BoxrecRequests, "getPersonById");
            spy.mockReturnValueOnce(Promise.resolve(""));
            spy.mockReturnValueOnce(Promise.resolve(""));
            await Boxrec.getPersonById(loggedInCookie, 401002, BoxrecRole.judge);
            expect(spy).toHaveBeenCalledWith(loggedInCookie, 401002, BoxrecRole.judge, 0);
        });

        it("supplying an `offset` value will append this to the URL", async () => {
            const spy: SpyInstance = jest.spyOn(BoxrecRequests, "getPersonById");
            spy.mockReturnValueOnce(Promise.resolve(""));
            spy.mockReturnValueOnce(Promise.resolve(""));
            await Boxrec.getPersonById(loggedInCookie, 401002, BoxrecRole.judge, 20);
            expect(spy).toHaveBeenCalledWith(loggedInCookie, 401002, BoxrecRole.judge, 20);
        });

    });

    describe("method getEventById", () => {

        it("should make a GET request to https://boxrec.com/en/event/${eventId}", async () => {
            await Boxrec.getEventById(loggedInCookie, 555);
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/event/555",
            }));
        });

    });

    describe("method getBoutById", () => {

        it("should make a GET request to https://boxrec.com/en/event (with bout)", async () => {
            await Boxrec.getBoutById(loggedInCookie, "771321/2257534");
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/event/771321/2257534",
            }));
        });

    });

    describe("method getPeopleByName", () => {

        it("should return a generator of boxers it found", async () => {
            const searchResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await Boxrec.getPeopleByName(loggedInCookie, "test", "test");
            expect(searchResults.next()).toBeDefined();
        });

        it("should make a call to boxrec every time the generator next method is called", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            spy.mockReturnValue(Promise.resolve(mockProfileBoxerRJJ));
            const getSpy: SpyInstance = jest.spyOn(Boxrec, "getPersonById");
            jest.spyOn(Boxrec, "search").mockReturnValueOnce([{id: 999}, {id: 888}]);
            const searchResults: AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> = await Boxrec.getPeopleByName(loggedInCookie, "test", "test");
            expect(getSpy).toHaveBeenCalledTimes(0);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(1);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(2);
        });

    });

    describe("method getResults", () => {

        it("should make a GET request to https://boxrec.com/en/results", async () => {
            await Boxrec.getResults(loggedInCookie, {});
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/results",
            }));
        });

    });

    describe("method getSchedule", () => {

        it("should make a GET request to https://boxrec.com/en/schedule", async () => {
            await Boxrec.getSchedule(loggedInCookie, {});
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/schedule",
            }));
        });

    });

    describe("method getPeopleByLocation", () => {

        it("should make a GET request to https://boxrec.com/en/locations/people", async () => {
            await Boxrec.getPeopleByLocation(loggedInCookie, {
                role: BoxrecRole.proBoxer,
            });
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/locations/people",
            }));
        });

    });

    describe("method getEventsByLocation", () => {

        it("should make a GET request to https://boxrec.com/en/locations/event", async () => {
            await Boxrec.getEventsByLocation(loggedInCookie, {
                country: Country.Albania,
                sport: BoxrecFighterOption["Pro Boxing"],
            });
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/locations/event",
            }));
        });

    });

    describe("method getTitleById", () => {

        it("should make a GET request to https://Boxrec.cox/en/title/${title}", async () => {
            await Boxrec.getTitleById(loggedInCookie, "6/Middleweight");
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/title/6/Middleweight",
            }));
        });

    });

    describe("method getVenueById", () => {

        it("should make a GET request to https://boxrec.com/en/venue/555", async () => {
            await Boxrec.getVenueById(loggedInCookie, 555);
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/venue/555",
            }));
        });

    });

    describe("method search", () => {

        beforeAll(() => {
            Object.defineProperty(Boxrec, "searchParamWrap", {
                configurable: true,
                get: jest.fn(() => "abc"),
            });
        });

        it("should make a GET request to https://boxrec.com/en/search", async () => {
            await Boxrec.search(loggedInCookie, {
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.judge,
                status: BoxrecStatus.all,
            });
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/search",
            }));
        });

        it("should not send any keys that aren't wrapped in []", async () => {
            const spy: SpyInstance = jest.spyOn(rp, "get");
            await Boxrec.search(loggedInCookie, {
                first_name: "bla",
                last_name: "",
                role: BoxrecRole.proBoxer,
                status: BoxrecStatus.all,
            });
            expect(rp).not.toHaveBeenCalledWith(jasmine.objectContaining({
                qs: {
                    first_name: jasmine.anything(),
                },
            }));
        });

    });

    describe("method getChampions", () => {

        it("should make a GET request to https://boxrec.com/en/champions", async () => {
            await Boxrec.getChampions(loggedInCookie);
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                url: "https://boxrec.com/en/champions",
            }));
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
            await Boxrec.getBoxerPDF(loggedInCookie, 555);
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                qs: {
                    pdf: "y",
                },
            }));
        });

        it("should not save to the directory it is called from if no path supplied", async () => {
            const spyStream: Mock<any> = jest.spyOn(fs, "createWriteStream").mockReturnValueOnce("test2");
            await Boxrec.getBoxerPDF(loggedInCookie, 555);
            return expect(spyStream).not.toHaveBeenCalled();
        });

        it("should append a `/` to the path if one was not supplied", async () => {
            testFileWrite(loggedInCookie, "getBoxerPDF", "./foo", "bar.pdf", "./foo/bar.pdf");
        });

        it("should use the globalId of the boxer if no file name is supplied", async () => {
            testFileWrite(loggedInCookie, "getBoxerPDF", "./foo", null, "./foo/555.pdf");
        });

    });

    describe("method getBoxerPrint", () => {

        it("should make a GET request with query string that contains `print`", async () => {
            await Boxrec.getBoxerPrint(loggedInCookie, 555);
            expect(rp).toHaveBeenCalledWith(jasmine.objectContaining({
                qs: {
                    print: "y"
                },
            }));
        });

        it("should save the file with `.html` file type", async () => {
            testFileWrite(loggedInCookie, "getBoxerPrint", "./foo", null, "./foo/555.html");
        });

    });

    describe("method watch", () => {

        it("should throw an error if the boxer doesn't appear in the list", async () => {
            jest.spyOn(BoxrecPageWatch.prototype, "checkForBoxerInList").mockReturnValueOnce(false);
            try {
                await Boxrec.watch(loggedInCookie, 352);
            } catch (e) {
                expect(e.message).toBe("Boxer did not appear in list after being added");
            }
        });

    });

    describe("method unwatch", () => {

        it("should throw an error if the boxer does appear in the list", async () => {
            jest.spyOn(BoxrecPageWatch.prototype, "checkForBoxerInList").mockReturnValue(true);
            try {
                await Boxrec.unwatch(loggedInCookie, 352);
            } catch (e) {
                expect(e.message).toBe("Boxer appears in list after being removed");
            }
        });

    });

    describe("method getWatched", () => {

        it("should return a list of watched boxers", async () => {
            const spy: SpyInstance = jest.spyOn(BoxrecRequests, "getWatched");
            await Boxrec.getWatched(loggedInCookie);
            expect(spy).toHaveBeenCalled();
        });

    });

});
