import {CookieJar, RequestResponse} from "request";
import {BoxrecPageRatings} from "./boxrec-pages/ratings/boxrec.page.ratings";
import {BoxrecPageSearch} from "./boxrec-pages/search/boxrec.page.search";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecRatingsParams, BoxrecRatingsParamsTransformed} from "./boxrec-pages/ratings/boxrec.ratings.constants";
import {
    BoxrecRole,
    BoxrecSearch,
    BoxrecSearchParams,
    BoxrecSearchParamsTransformed,
    BoxrecStatus
} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageProfile} from "./boxrec-pages/profile/boxrec.page.profile";
import {Options} from "request-promise";

// https://github.com/Microsoft/TypeScript/issues/14151
if (typeof (Symbol as any).asyncIterator === "undefined") {
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");
}

const rp: any = require("request-promise");

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
        let rawCookies: string[];

        try {
            rawCookies = await this.getSessionCookie();
        } catch (e) {
            throw new Error("Could not get response from boxrec");
        }

        if (!rawCookies || !rawCookies[0]) {
            throw new Error("Could not get cookie from initial request to boxrec");
        }

        const cookie: string = rp.cookie(rawCookies[0]); // create the cookie
        this._cookieJar.setCookie(cookie, "http://boxrec.com");

        const options: Options = {
            url: "http://boxrec.com/en/login", // boxrec does not support HTTPS
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

                    let errorMessage: string = "";

                    // if the user hasn't given consent, the user is redirected to a user that contains `gdpr`
                    if (data.request.uri.pathname.includes("gdpr") || data.body.toLowerCase().includes("gdpr")) {
                        errorMessage = "GDPR consent is needed with this account.  Log into BoxRec through their website and accept before using this account";
                    }

                    // the following are when login has failed
                    // an unsuccessful login returns a 200, we'll look for phrases to determine the error
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

        const cookieString: any = this._cookieJar.getCookieString("http://boxrec.com");

        if (cookieString && cookieString.includes("PHPSESSID") && cookieString.includes("REMEMBERME")) {
            return; // success
        } else {
            throw new Error("Cookie did not have PHPSESSID and REMEMBERME");
        }
    }

    /**
     * Make a request to BoxRec to get a person by their BoxRec Global ID
     * @param {number} globalId          the BoxRec profile id
     * @param {BoxrecRole} role          the role of the person in boxing (there seems to be multiple profiles for people if they fall under different roles)
     * @returns {Promise<BoxrecPageProfile>}
     */
    async getPersonById(globalId: number, role: BoxrecRole = BoxrecRole.boxer): Promise<BoxrecPageProfile> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            uri: `http://boxrec.com/en/${role}/${globalId}`,
            jar: this._cookieJar,
        });

        return new BoxrecPageProfile(boxrecPageBody);
    }

    /**
     * Makes a search request to BoxRec to get all people that match that name
     * by using a generator, we're trying to prevent making too many calls to BoxRec
     * @param {string} firstName            the person's first name
     * @param {string} lastName             the person's last name
     * @param {string} role                 the role of the person
     * @param {BoxrecStatus} status         whether the person is active in Boxing or not
     * @yields {BoxrecPageProfile>}         yields a generator to fetch the next person by ID
     */
    async * getPeopleByName(firstName: string, lastName: string, role: BoxrecRole = BoxrecRole.boxer, status: BoxrecStatus = BoxrecStatus.all): AsyncIterableIterator<BoxrecPageProfile> {
        this.checkIfLoggedIntoBoxRec();
        const params: BoxrecSearchParams = {
            first_name: firstName,
            last_name: lastName,
            role,
            status,
        };
        const searchResults: RequestResponse["body"] = await this.search(params);

        for (const result of searchResults) {
            yield await this.getPersonById(result.id);
        }
    }

    /**
     * Makes a request to BoxRec to return a list of current champions
     * @returns {Promise<BoxrecPageChampions>}
     */
    async getChampions(): Promise<BoxrecPageChampions> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            uri: "http://boxrec.com/en/champions",
            jar: this._cookieJar,
        });

        return new BoxrecPageChampions(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of ratings/rankings, either P4P or by a single weight class
     * @param {Object|undefined} params           the query string that is appended to the end of the URL
     * @param {string|undefined} params.division  the weightclass/division to get ratings for.  Omitting this returns P4P ratings
     * @param {string|undefined} params.sex       the sex of the boxer's, either "M" | "F", I believe it defaults to "M" if not supplied
     * @param {string|undefined} params.status    whether to include only active fighters or not, "a" | ""
     * @returns {Promise<BoxrecPageRatings>}
     */
    async getRatings(params?: BoxrecRatingsParams): Promise<BoxrecPageRatings> {
        this.checkIfLoggedIntoBoxRec();
        const qs: BoxrecRatingsParamsTransformed = {};

        if (params) {
            for (let i in params) {
                (qs as any)[`r[${i}]`] = (params as any)[i];
            }
        }

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            uri: "http://boxrec.com/en/ratings",
            qs,
            jar: this._cookieJar,
        });

        return new BoxrecPageRatings(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to retrieve an event by id
     * @param {number} eventId      the event id from BoxRec
     * @returns {Promise<BoxrecPageEvent>}
     */
    async getEventById(eventId: number): Promise<BoxrecPageEvent> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            uri: `http://boxrec.com/en/event/${eventId}`,
            jar: this._cookieJar,
        });

        return new BoxrecPageEvent(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to search people by
     * Note: currently only supports boxers
     * @param {Object} params                   the query string that is appended to the end of the URL
     * @param {string} params.first_name        the first name to search for
     * @param {string} params.last_name         the last name to search for
     * @param {string} params.role              the role to search for, currently only supports boxers
     * @param {BoxrecRole} params.status        if the person is active
     * @returns {Promise<BoxrecSearch[]>}
     */
    async search(params: BoxrecSearchParams): Promise<BoxrecSearch[]> {
        this.checkIfLoggedIntoBoxRec();

        if (!params.first_name && !params.last_name) {
            // BoxRec says 2 or more characters, it's actually 3 or more
            throw new Error("Requires `first_name` or `last_name` - minimum 3 characters long");
        }

        if (params.role && params.role !== BoxrecRole.boxer) {
            throw new Error("Currently search only supports boxers");
        }

        const qs: BoxrecSearchParamsTransformed = Object.seal({
            "pf[first_name]": "",
            "pf[last_name]": "",
            "pf[role]": BoxrecRole.boxer,
            "pf[status]": BoxrecStatus.all,
        });

        for (let i in params) {
            (qs as any)[`pf[${i}]`] = (params as any)[i];
        }

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
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
        const cookieString: any = this._cookieJar.getCookieString("http://boxrec.com");

        if (!cookieString.includes("PHPSESSID") || !cookieString.includes("REMEMBERME")) {
            throw new Error("This package requires logging into BoxRec to work properly.  Please use the `login` method before any other calls");
        }
    }

}

module.exports = new Boxrec();
