const Boxrec = require("./boxrec.class");

jest.mock("request-promise");
const rp = require("request-promise");

describe("class Boxrec", () => {

    describe("method login", () => {

        describe("getting PHPSESSID", () => {

            it("should make a GET request to http://boxrec.com to get the PHPSESSID", async () => {
                const spy = jest.spyOn(rp, <any>"get");
                await Boxrec.login("", "");
                expect(spy.mock.calls[0][0].uri).toBe("http://boxrec.com");
            });

            it("should throw if it could not get the initial PHPSESSID", async () => {
                const spy = jest.spyOn(rp, <any>"get");
                spy.mockReturnValueOnce(Promise.resolve({headers: {"set-cookie": []}}));
                await expect(Boxrec.login("", "")).rejects.toThrowError("Could not get cookie from initial request to boxrec");
            });

            it("should throw if the HTTP status code is an error code", async () => {
                const spy = jest.spyOn(rp, <any>"get");
                spy.mockReturnValueOnce(Promise.reject({headers: {"set-cookie": "works"}}));
                await expect(Boxrec.login("", "")).rejects.toThrowError("Could not get response from boxrec");
            });

        });

        describe("logging in", () => {

            it("should make a POST request to http://boxrec.com/en/login", async () => {
                const spy = jest.spyOn(rp, <any>"post");
                await Boxrec.login("", "");
                expect(spy.mock.calls[spy.mock.calls.length - 1][0].uri).toBe("http://boxrec.com/en/login");
            });

            it("should throw if boxrec returns that the username does not exist", async () => {
                const spy = jest.spyOn(rp, <any>"post");
                spy.mockReturnValueOnce(Promise.resolve({body: "<div>username does not exist</div>"})); // resolve because 200 response
                await expect(Boxrec.login("", "")).rejects.toThrowError("Username does not exist");
            });

            it("should throw if boxrec returns that the password is not correct", async () => {
                const spy = jest.spyOn(rp, <any>"post");
                spy.mockReturnValueOnce(Promise.resolve({body: "<div>your password is incorrect</div>"})); // resolve because 200 response
                await expect(Boxrec.login("", "")).rejects.toThrowError("Your password is incorrect");
            });

            it("should return undefined if it was a success", async () => {
                const response = await Boxrec.login("", "");
                expect(response).toBeUndefined();
            });

            it("should throw if after successfully logging in the cookie does not include PHPSESSID", async () => {
                const spy = jest.spyOn(rp, <any>"jar");
                spy.mockReturnValue({
                    getCookieString: () => {
                        return "REMEMBERME=123";
                    },
                    setCookie: () => {
                    }
                });
                await expect(Boxrec.login("", "")).rejects.toThrowError("Cookie did not have PHPSESSID and REMEMBERME");
            });

            it("should throw if after successfully logging in the cookie does not include REMEMBERME", async () => {
                const spy = jest.spyOn(rp, <any>"jar");
                spy.mockReturnValue({
                    getCookieString: () => {
                        return "PHPSESSID=123";
                    },
                    setCookie: () => {
                    }
                });
                await expect(Boxrec.login("", "")).rejects.toThrowError("Cookie did not have PHPSESSID and REMEMBERME");
            });

        });

    });

    describe("method getRatings", () => {

        it("should make a GET request to http://boxrec.com/en/ratings", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.getRatings();
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].uri).toBe("http://boxrec.com/en/ratings");
        });

        it("should clone any keys in the object and wrap with `r[]`", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.getRatings({
                foo: "bar"
            });
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].qs).toEqual({"r[foo]": "bar"});
        });

        it("should not send any keys that aren't wrapped in r[]", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.getRatings({
                foo: "bar"
            });
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].qs["foo"]).not.toBeDefined();
        });

    });

    describe("method getBoxerById", () => {

        it("should make a GET request to http://boxrec.com/en/boxer/{globalID}", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.getBoxerById(555);
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].uri).toBe("http://boxrec.com/en/boxer/555");
        });

    });

    describe("method getBoxersByName", () => {

        it("should return a generator of boxers it found", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            const searchResults = await Boxrec.getBoxersByName("test", "test");
            expect(searchResults.next()).toBeDefined();
        });

        it("should make a call to Boxrec everytime the generator next method is called", async () => {
            const getSpy = jest.spyOn(Boxrec, <any>"getBoxerById");
            jest.spyOn(Boxrec, <any>"search").mockReturnValueOnce([{id: 999}, {id: 888}]);
            const searchResults = await Boxrec.getBoxersByName("test", "test");
            expect(getSpy).toHaveBeenCalledTimes(0);
            await searchResults.next(); // makes an API call
            expect(getSpy).toHaveBeenCalledTimes(1);
        });

    });

    describe("method search", () => {

        it("should make a GET request to http://boxrec.com/en/search", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.search({
                "first_name": "bla",
            });
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].uri).toBe("http://boxrec.com/en/search");
        });

        it("should clone any keys in the object and wrap with `pf[]`", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.search({
                "first_name": "bla",
            });
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].qs["pf[first_name]"]).toBe("bla");
        });

        it("should send role=boxer because that's all we can currently support", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.search({
                "first_name": "bla",
            });
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].qs["pf[role]"]).toBe("boxer");
        });

        it("should not send any keys that aren't wrapped in pf[]", async () => {
            const spy = jest.spyOn(rp, <any>"get");
            await Boxrec.search({
                first_name: "bla",
            });
            expect(spy.mock.calls[spy.mock.calls.length - 1][0].qs["first_name"]).not.toBeDefined();
        });

    });

});
