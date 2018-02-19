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
                expect(spy.mock.calls[0][0].uri).toBe("http://boxrec.com/en/login");
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

            it("should throw if after successfully logging in the cookie does not include PHPSESSID", async () => {
                const spy = jest.spyOn(rp, <any>"jar");
                spy.mockReturnValueOnce({
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
                spy.mockReturnValueOnce({
                    getCookieString: () => {
                        return "PHPSESSID=123";
                    },
                    setCookie: () => {
                    }
                });
                await expect(Boxrec.login("", "")).rejects.toThrowError("Cookie did not have PHPSESSID and REMEMBERME");
            });

            it("should return undefined if it was a success", async () => {
                const response = await Boxrec.login("", "");
                expect(response).not.toBeDefined();
            });

        });

    });

    describe("method getBoxerById", () => {

        it("should make a request to boxrec", () => {

        });

        it("should return ")

    });

});
