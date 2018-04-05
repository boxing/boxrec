import {CookieJar} from "tough-cookie";
import {RequestResponse} from "request";
import {BoxrecProfile, BoxrecRating, BoxrecSearch} from "./boxrec-pages/boxrec.constants";
import {BoxrecPageRatings} from "./boxrec-pages/boxrec.page.ratings";
import {BoxrecPageSearch} from "./boxrec-pages/boxrec.page.search";

// https://github.com/Microsoft/TypeScript/issues/14151
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

const rp = require("request-promise");
const BoxrecPageProfile = require("./boxrec-pages/boxrec.page.profile");

export class Boxrec {

    private _hasLoggedIn: boolean = false;
    private _cookieJar: CookieJar;

    async login(username: string, password: string): Promise<void> {

        const cookieJar: CookieJar = rp.jar();
        let rawCookies;

        try {
            rawCookies = await this.getSessionCookie();
        } catch (e) {
            throw new Error("Could not get response from boxrec");
        }

        if (!rawCookies || !rawCookies[0]) {
            throw new Error("Could not get cookie from initial request to boxrec");
        }

        const cookie = rp.cookie(rawCookies[0]);

        cookieJar.setCookie(cookie, "http://boxrec.com", () => {
        });

        this._cookieJar = cookieJar;

        const options = {
            uri: "http://boxrec.com/en/login", // boxrec does not support HTTPS
            followAllRedirects: true, // 302 redirect occurs
            resolveWithFullResponse: true,
            formData: {
                "_username": username,
                "_password": password,
                "_remember_me": "on",
                "_target_path": "http://boxrec.com", // not required
                "login[go]": "", // not required
            },
            jar: this._cookieJar,
        };

        await rp.post(options)
            .then((data: RequestResponse) => {
                // an unsuccessful login returns a 200, we'll look for phrases to determine the error
                let errorMessage: string = "";

                if (data.body.includes("your password is incorrect")) {
                    errorMessage = "Your password is incorrect";
                }

                if (data.body.includes("username does not exist")) {
                    errorMessage = "Username does not exist";
                }

                if (data.statusCode !== 200 || errorMessage !== "") {
                    throw new Error(errorMessage);
                }
            });

        // it argues that the return value is void
        const cookieString: any = cookieJar.getCookieString("http://boxrec.com", () => {
            // the callback doesn't work but it works if you assign as a variable?
        });

        if (cookieString && cookieString.includes("PHPSESSID") && cookieString.includes("REMEMBERME")) {
            this._hasLoggedIn = true;
            return; // success
        } else {
            throw new Error("Cookie did not have PHPSESSID and REMEMBERME");
        }
    }

    async getBoxerById(boxrecBoxerId: number): Promise<BoxrecProfile> {
        this.checkIfLoggedIn();
        const boxrecPageBody = await rp.get({
            uri: `http://boxrec.com/en/boxer/${boxrecBoxerId}`,
            jar: this._cookieJar,
        });

        return new BoxrecPageProfile(boxrecPageBody);
    }

    /**
     * Returns individual Boxrec profiles
     * by using a generator, we're trying to prevent making too many calls to Boxrec
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} active   default is false, which includes active and inactive
     */
    async *getBoxersByName(firstName: string, lastName: string, active: boolean = false) {
        this.checkIfLoggedIn();
        const status: string = active ? "a" : "";
        const params = {
            first_name: firstName,
            last_name: lastName,
            status,
        };
        const searchResults = await this.search(params);

        for (const result of searchResults) {
            yield await this.getBoxerById(result.id);
        }
    }

    async getRatings(qs: any): Promise<BoxrecRating[]> {
        this.checkIfLoggedIn();
        for (let i in qs) {
            qs[`r[${i}]`] = qs[i];
            delete qs[i];
        }

        const boxrecPageBody = await rp.get({
            uri: "http://boxrec.com/en/ratings",
            qs,
            jar: this._cookieJar,
        });

        return new BoxrecPageRatings(boxrecPageBody).get;
    }

    async search(qs: any): Promise<BoxrecSearch[]> {
        this.checkIfLoggedIn();

        if (!qs.first_name && !qs.last_name) {
            // Boxrec says 2 or more characters, it's actually 3 or more
            throw new Error("Requires `first_name` or `last_name` - minimum 3 characters long");
        }

        if (qs.role && qs.role !== "boxer") {
            throw new Error("Currently search only supports boxers");
        }

        // todo currently this only works with boxers
        qs.role = "boxer";

        for (let i in qs) {
            qs[`pf[${i}]`] = qs[i];
            delete qs[i];
        }

        const boxrecPageBody = await rp.get({
            uri: "http://boxrec.com/en/search",
            qs,
            jar: this._cookieJar,
        });

        return new BoxrecPageSearch(boxrecPageBody).get;
    }

    // makes a request to get the PHPSESSID required to login
    private async getSessionCookie(): Promise<string[]> {
        return rp.get({
            uri: "http://boxrec.com",
            resolveWithFullResponse: true,
        }).then((data: RequestResponse) => data.headers["set-cookie"]);
    }

    private checkIfLoggedIn(): true | Error {
        if (this._hasLoggedIn) {
            return true;
        } else {
            throw new Error("This package requires logging into Boxrec to work properly.  Please use the `login` method before any other calls");
        }
    }

}

module.exports = new Boxrec();
