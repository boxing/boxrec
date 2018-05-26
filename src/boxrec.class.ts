import {CookieJar} from "tough-cookie";
import {RequestResponse} from "request";
import {BoxrecEvent, BoxrecProfile, BoxrecSearch} from "./boxrec-pages/boxrec.constants";
import {BoxrecPageRatings} from "./boxrec-pages/ratings/boxrec.page.ratings";
import {BoxrecPageSearch} from "./boxrec-pages/search/boxrec.page.search";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";

// https://github.com/Microsoft/TypeScript/issues/14151
if (typeof (Symbol as any).asyncIterator === "undefined") {
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");
}

const rp = require("request-promise");
const BoxrecPageProfile = require("./boxrec-pages/profile/boxrec.page.profile.ts");

export class Boxrec {

    private _cookieJar: CookieJar = rp.jar();

    /**
     * Makes a request to BoxRec to log the user in
     * This is required before making any additional calls
     * The session cookie is stored inside this class and lost
     * Note: credentials are sent over HTTP, BoxRec doesn't support HTTPS
     * @param {string} username     your BoxRec username
     * @param {string} password     your BoxRec password
     * @returns {Promise<void>}     If the response is undefined, you have successfully logged in.  Otherwise an error will be thrown
     */
    async login(username: string, password: string): Promise<void> {
        this._cookieJar = rp.jar(); // reset the cookieJar
        let rawCookies;

        try {
            rawCookies = await this.getSessionCookie();
        } catch (e) {
            throw new Error("Could not get response from boxrec");
        }

        if (!rawCookies || !rawCookies[0]) {
            throw new Error("Could not get cookie from initial request to boxrec");
        }

        const cookie = rp.cookie(rawCookies[0]); // create the cookie
        this._cookieJar.setCookie(cookie, "http://boxrec.com", () => {
        });

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

        try {
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
        } catch (e) {
            throw new Error(e);
        }

        // it argues that the return value is void
        const cookieString: any = this._cookieJar.getCookieString("http://boxrec.com", () => {
            // the callback doesn't work but it works if you assign as a variable?
        });

        if (cookieString && cookieString.includes("PHPSESSID") && cookieString.includes("REMEMBERME")) {
            return; // success
        } else {
            throw new Error("Cookie did not have PHPSESSID and REMEMBERME");
        }
    }

    /**
     * Make a request to BoxRec to get a boxer by their ID
     * @param {number} boxrecBoxerId    the BoxRec profile id
     * @returns {Promise<BoxrecProfile>}
     */
    async getBoxerById(boxrecBoxerId: number): Promise<BoxrecProfile> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody = await rp.get({
            uri: `http://boxrec.com/en/boxer/${boxrecBoxerId}`,
            jar: this._cookieJar,
        });

        return new BoxrecPageProfile(boxrecPageBody);
    }

    /**
     * Makes a search request to BoxRec to get all boxer's that match that name
     * by using a generator, we're trying to prevent making too many calls to BoxRec
     * @param {string} firstName            the boxer's first name
     * @param {string} lastName             the boxer's last name
     * @param {string|undefined} active     default is false, which includes active and inactive
     * @returns {AsyncIterableIterator<BoxrecProfile>}      returns a generator
     */
    async * getBoxersByName(firstName: string, lastName: string, active: boolean = false): AsyncIterableIterator<BoxrecProfile> {
        this.checkIfLoggedIntoBoxRec();

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

    /**
     * Makes a request to BoxRec to return a list of current champions
     * @returns {Promise<BoxrecPageChampions>}
     */
    async getChampions(): Promise<BoxrecPageChampions> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody = await rp.get({
            uri: "http://boxrec.com/en/champions",
            jar: this._cookieJar,
        });

        return new BoxrecPageChampions(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of ratings/rankings, either P4P or by a single weight class
     * @param {Object|undefined} qs           the query string that is appended to the end of the URL
     * @param {string|undefined} qs.division  the weightclass/division to get ratings for.  Omitting this returns P4P ratings
     * @param {string|undefined} qs.sex       the sex of the boxer's, either "M" | "F", I believe it defaults to "M" if not supplied
     * @param {string|undefined} qs.status    whether to include only active fighters or not, "a" | ""
     * @returns {Promise<BoxrecPageRatings>}
     */
    async getRatings(qs: any): Promise<BoxrecPageRatings> {
        this.checkIfLoggedIntoBoxRec();

        for (let i in qs) {
            qs[`r[${i}]`] = qs[i];
            delete qs[i];
        }

        const boxrecPageBody = await rp.get({
            uri: "http://boxrec.com/en/ratings",
            qs,
            jar: this._cookieJar,
        });

        return new BoxrecPageRatings(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to retrieve an event by id
     * @param {number} eventId      the event id from BoxRec
     * @returns {Promise<BoxrecEvent>}
     */
    async getEventById(eventId: number): Promise<BoxrecEvent> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody = await rp.get({
            uri: `http://boxrec.com/en/event/${eventId}`,
            jar: this._cookieJar,
        });

        return new BoxrecPageEvent(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to search people by
     * Note: currently only supports boxers
     * @param {Object} qs                   the query string that is appended to the end of the URL
     * @param {string} qs.first_name        the first name to search for
     * @param {string} qs.last_name         the last name to search for
     * @param {string} qs.role              the role to search for, currently only supports boxers
     * @returns {Promise<BoxrecSearch[]>}
     */
    async search(qs: any): Promise<BoxrecSearch[]> {
        this.checkIfLoggedIntoBoxRec();

        if (!qs.first_name && !qs.last_name) {
            // BoxRec says 2 or more characters, it's actually 3 or more
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

        return new BoxrecPageSearch(boxrecPageBody).output;
    }

    /**
     * Makes a request to get the PHPSESSID required to login
     * @returns {Promise<string[]>}
     */
    private async getSessionCookie(): Promise<string[]> {
        return rp.get({
            uri: "http://boxrec.com",
            resolveWithFullResponse: true,
        }).then((data: RequestResponse) => data.headers["set-cookie"]);
    }

    /**
     * Checks that the cookie jar contains the values we need
     * Throws error if they do not exist
     */
    private checkIfLoggedIntoBoxRec(): void {
        const cookieString: any = this._cookieJar.getCookieString("http://boxrec.com", () => {
            // the callback doesn't work but it works if you assign as a variable?
        });

        if (!cookieString.includes("PHPSESSID") || !cookieString.includes("REMEMBERME")) {
            throw new Error("This package requires logging into BoxRec to work properly.  Please use the `login` method before any other calls");
        }
    }

}

module.exports = new Boxrec();
