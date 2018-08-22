import {CookieJar, RequestResponse} from "request";
import {Options} from "request-promise";
import {Cookie} from "tough-cookie";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageDate} from "./boxrec-pages/date/boxrec.page.date";
import {BoxrecPageEventBout} from "./boxrec-pages/event/bout/boxrec.page.event.bout";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecLocationEventParams} from "./boxrec-pages/location/event/boxrec.location.event.constants";
import {BoxrecPageLocationEvent} from "./boxrec-pages/location/event/boxrec.page.location.event";
import {
    BoxrecLocationsPeopleParams,
    BoxrecLocationsPeopleParamsTransformed,
} from "./boxrec-pages/location/people/boxrec.location.people.constants";
import {BoxrecPageLocationPeople} from "./boxrec-pages/location/people/boxrec.page.location.people";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileJudgeSupervisor} from "./boxrec-pages/profile/boxrec.page.profile.judgeSupervisor";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";
import {BoxrecPageRatings} from "./boxrec-pages/ratings/boxrec.page.ratings";
import {BoxrecRatingsParams, BoxrecRatingsParamsTransformed} from "./boxrec-pages/ratings/boxrec.ratings.constants";
import {BoxrecResultsParams, BoxrecResultsParamsTransformed} from "./boxrec-pages/results/boxrec.results.constants";
import {BoxrecPageSchedule} from "./boxrec-pages/schedule/boxrec.page.schedule";
import {BoxrecScheduleParams} from "./boxrec-pages/schedule/boxrec.schedule.constants";
import {BoxrecPageSearch} from "./boxrec-pages/search/boxrec.page.search";
import {
    BoxrecRole,
    BoxrecSearch,
    BoxrecSearchParams,
    BoxrecSearchParamsTransformed,
    BoxrecStatus
} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageTitle} from "./boxrec-pages/title/boxrec.page.title";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";

// https://github.com/Microsoft/TypeScript/issues/14151
if (typeof (Symbol as any).asyncIterator === "undefined") {
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");
}

const rp: any = require("request-promise");

export class Boxrec {

    private _cookieJar: CookieJar = rp.jar();

    get cookies(): Cookie[] {
        return this._cookieJar.getCookies("http://boxrec.com");
    }

    set cookies(cookiesArr: Cookie[]) {
        this._cookieJar = rp.jar(); // reset the cookieJar
        cookiesArr.forEach(item => this._cookieJar.setCookie(item, "http://boxrec.com"));
    }

    /**
     * Makes a request to get the PHPSESSID required to login
     * @returns {Promise<string[]>}
     */
    private static async getSessionCookie(): Promise<string[]> {
        const options: Options = {
            resolveWithFullResponse: true,
            uri: "http://boxrec.com",
        };

        return rp.get(options).then((data: RequestResponse) => data.headers["set-cookie"]);
    }

    /**
     * Makes a request to BoxRec to get information about an individual bout
     * @param {string} eventBoutId
     * @returns {Promise<BoxrecPageEventBout>}
     */
    async getBout(eventBoutId: string): Promise<BoxrecPageEventBout> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri: `http://boxrec.com/en/event/${eventBoutId}`,
        });

        return new BoxrecPageEventBout(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to return a list of current champions
     * @returns {Promise<BoxrecPageChampions>}
     */
    async getChampions(): Promise<BoxrecPageChampions> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri: "http://boxrec.com/en/champions",
        });

        return new BoxrecPageChampions(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get events/bouts on the particular date
     * @param {string} dateString   date to search for.  Format ex. `2012-06-07`
     * @returns {Promise<void>}
     */
    async getDate(dateString: string): Promise<BoxrecPageDate> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri: `http://boxrec.com/en/date?date=${dateString}`,
        });

        return new BoxrecPageDate(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to retrieve an event by id
     * @param {number} eventId      the event id from BoxRec
     * @returns {Promise<BoxrecPageEvent>}
     */
    async getEventById(eventId: number): Promise<BoxrecPageEvent> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri: `http://boxrec.com/en/event/${eventId}`,
        });

        return new BoxrecPageEvent(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to list events by location
     * @param {BoxrecLocationEventParams} params    params included in this search
     * @param {number} offset                       the number of rows to offset the search
     * @returns {Promise<BoxrecPageLocationEvent>}
     */
    async getEventsByLocation(params: BoxrecLocationEventParams, offset: number = 0): Promise<BoxrecPageLocationEvent> {
        this.checkIfLoggedIntoBoxRec();
        const qs: BoxrecLocationEventParams = {};

        for (const i in params) {
            (qs as any)[`l[${i}]`] = (params as any)[i];
        }

        qs.offset = offset;

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            qs,
            uri: `http://boxrec.com/en/locations/event`,
        });

        return new BoxrecPageLocationEvent(boxrecPageBody);
    }

    /**
     * Make a request to BoxRec to search for people by location
     * @param {BoxrecLocationsPeopleParams} params  params included in this search
     * @param {number} offset                       the number of rows to offset the search
     * @returns {Promise<BoxrecPageLocationPeople>}
     */
    async getPeopleByLocation(params: BoxrecLocationsPeopleParams, offset: number = 0): Promise<BoxrecPageLocationPeople> {
        this.checkIfLoggedIntoBoxRec();
        const qs: BoxrecLocationsPeopleParamsTransformed = {};

        for (const i in params) {
            (qs as any)[`l[${i}]`] = (params as any)[i];
        }

        qs.offset = offset;

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            qs,
            uri: `http://boxrec.com/en/locations/people`,
        });

        return new BoxrecPageLocationPeople(boxrecPageBody);
    }

    /**
     * Makes a search request to BoxRec to get all people that match that name
     * by using a generator, we're able to prevent making too many calls to BoxRec
     * @param {string} firstName            the person's first name
     * @param {string} lastName             the person's last name
     * @param {string} role                 the role of the person
     * @param {BoxrecStatus} status         whether the person is active in Boxing or not
     * @param {number} offset               the number of rows to offset the search
     * @yields {BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager}         returns a generator to fetch the next person by ID
     */
    async* getPeopleByName(firstName: string, lastName: string, role: BoxrecRole = BoxrecRole.boxer, status: BoxrecStatus = BoxrecStatus.all, offset: number = 0): AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager> {
        this.checkIfLoggedIntoBoxRec();
        const params: BoxrecSearchParams = {
            first_name: firstName,
            last_name: lastName,
            role,
            status,
        };
        const searchResults: RequestResponse["body"] = await this.search(params, offset);

        for (const result of searchResults) {
            yield await this.getPersonById(result.id);
        }
    }

    /**
     * Make a request to BoxRec to get a person by their BoxRec Global ID
     * @param {number} globalId                 the BoxRec profile id
     * @param {BoxrecRole} role                 the role of the person in boxing (there seems to be multiple profiles for people if they fall under different roles)
     * @param {number} offset                   offset number of bouts/events in the profile.  Not used for boxers as boxer's profiles list all bouts they've been in
     * @param {boolean} callWithToggleRatings   if true, will call the profile with `toggleRatings=y` to get all 16 columns in profile bouts
     * @returns {Promise<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager>}
     */
    async getPersonById(globalId: number, role: BoxrecRole = BoxrecRole.boxer, offset: number = 0): Promise<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager> {
        return this.makeGetPersonByIdRequest(globalId, role, offset);
    }

    /**
     * Makes a request to BoxRec to get a list of ratings/rankings, either P4P or by a single weight class
     * @param {BoxrecRatingsParams} params      params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageRatings>}
     */
    async getRatings(params: BoxrecRatingsParams, offset: number = 0): Promise<BoxrecPageRatings> {
        this.checkIfLoggedIntoBoxRec();
        const qs: BoxrecRatingsParamsTransformed = {};

        for (const i in params) {
            (qs as any)[`r[${i}]`] = (params as any)[i];
        }

        qs.offset = offset;

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            qs,
            uri: "http://boxrec.com/en/ratings",
            jar: this._cookieJar,
        });

        return new BoxrecPageRatings(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of results.
     * Uses same class
     * @param {BoxrecResultsParams} params  params included in this search
     * @param {number} offset               the number of rows to offset this search
     * @returns {Promise<BoxrecPageResults>}
     */
    async getResults(params: BoxrecResultsParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        this.checkIfLoggedIntoBoxRec();

        const qs: BoxrecResultsParamsTransformed =
            this.buildResultsSchedulesParams<BoxrecResultsParamsTransformed>(params, offset);

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            qs,
            uri: "http://boxrec.com/en/results",
        });

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of scheduled events
     * @param {BoxrecScheduleParams} params     params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageSchedule>}
     */
    async getSchedule(params: BoxrecScheduleParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        this.checkIfLoggedIntoBoxRec();

        const qs: BoxrecResultsParamsTransformed =
            this.buildResultsSchedulesParams<BoxrecResultsParamsTransformed>(params, offset);

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            qs,
            uri: "http://boxrec.com/en/schedule",
        });

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to the specific title URL to get a belt's history
     * @param {string} titleUrl     in the format of "6/Middleweight" which would be the WBC Middleweight title
     * @param {number} offset       the number of rows to offset the search
     * @returns {Promise<BoxrecPageTitle>}
     */
    async getTitle(titleUrl: string = "", offset: number = 0): Promise<BoxrecPageTitle> {
        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri: `http://boxrec.com/en/title/${titleUrl}`,
        });

        return new BoxrecPageTitle(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get the information of a venue
     * @param {number} venueId
     * @param {number} offset   the number of rows to offset the search
     * @returns {Promise<BoxrecPageVenue>}
     */
    async getVenueById(venueId: number, offset: number = 0): Promise<BoxrecPageVenue> {
        this.checkIfLoggedIntoBoxRec();

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri: `http://boxrec.com/en/venue/${venueId}?offset=${offset}`,
        });

        return new BoxrecPageVenue(boxrecPageBody);
    }

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
        let rawCookies: string[];

        try {
            rawCookies = await Boxrec.getSessionCookie();
        } catch (e) {
            throw new Error("Could not get response from boxrec");
        }

        if (!rawCookies || !rawCookies[0]) {
            throw new Error("Could not get cookie from initial request to boxrec");
        }

        const cookie: Cookie = rp.cookie(rawCookies[0]);
        this.cookies = [cookie];

        const options: Options = {
            followAllRedirects: true, // 302 redirect occurs
            formData: {
                "_password": password,
                "_remember_me": "on",
                "_target_path": "http://boxrec.com", // not required,
                "_username": username,
                "login[go]": "", // not required
            },
            jar: this._cookieJar,
            resolveWithFullResponse: true,
            url: "http://boxrec.com/en/login", // boxrec does not support HTTPS
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

        if (this.hasRequiredCookiesForLogIn()) {
            return; // success
        } else {
            throw new Error("Cookie did not have PHPSESSID and REMEMBERME");
        }
    }

    /**
     * Makes a request to BoxRec to search people by
     * Note: currently only supports boxers
     * @param {BoxrecSearchParams} params   params included in this search
     * @param {number}             offset   the number of rows to offset the search
     * @returns {Promise<BoxrecSearch[]>}
     */
    async search(params: BoxrecSearchParams, offset: number = 0): Promise<BoxrecSearch[]> {
        this.checkIfLoggedIntoBoxRec();

        if (!params.first_name && !params.last_name) {
            // BoxRec says 2 or more characters, it's actually 3 or more
            throw new Error("Requires `first_name` or `last_name` - minimum 3 characters long");
        }

        if (params.role && params.role !== BoxrecRole.boxer) {
            throw new Error("Currently search only supports boxers");
        }

        const qs: BoxrecSearchParamsTransformed = {};

        for (const i in params) {
            (qs as any)[`pf[${i}]`] = (params as any)[i];
        }

        qs.offset = offset;

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            uri: "http://boxrec.com/en/search",
            qs,
            jar: this._cookieJar,
        });

        return new BoxrecPageSearch(boxrecPageBody).results;
    }

    private buildResultsSchedulesParams<T>(params: any, offset: number): T {
        const qs: any = {};

        for (const i in params) {
            (qs as any)[`c[${i}]`] = (params as any)[i];
        }

        qs.offset = offset;

        return qs as T;
    }

    /**
     * Checks that the cookie jar contains the values we need
     * Throws error if they do not exist
     */
    private checkIfLoggedIntoBoxRec(): void {
        if (!this.hasRequiredCookiesForLogIn()) {
            throw new Error("This package requires logging into BoxRec to work properly.  Please use the `login` method before any other calls");
        }
    }

    /**
     * Checks cookie jar to see if all required cookies are set
     * this does not necessarily mean the session is logged in
     * @returns {boolean}
     */
    private hasRequiredCookiesForLogIn(): boolean {
        const cookies: Cookie[] = this.cookies;
        const requiredCookies: string[] = ["PHPSESSID", "REMEMBERME"];

        cookies.forEach((cookie: Cookie) => {
            const index: number = requiredCookies.findIndex((val: string) => val === cookie.value);
            requiredCookies.splice(index);
        });

        return !requiredCookies.length;
    }

    private async makeGetPersonByIdRequest(globalId: number, role: BoxrecRole = BoxrecRole.boxer, offset: number = 0, callWithToggleRatings: boolean = false): Promise<BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager> {
        this.checkIfLoggedIntoBoxRec();
        let uri: string = `http://boxrec.com/en/${role}/${globalId}`;

        if (callWithToggleRatings) {
            uri += `?toggleRatings=y`;
        }

        const boxrecPageBody: RequestResponse["body"] = await rp.get({
            jar: this._cookieJar,
            uri,
        });

        let boxrecProfile: BoxrecPageProfileBoxer | BoxrecPageProfileJudgeSupervisor | BoxrecPageProfileEvents | BoxrecPageProfileManager;

        // there are 9 roles on the BoxRec website
        // the differences are that the boxers have 2 more columns `last6` for each boxer
        // the judge and others don't have those columns
        // the doctor and others have `events`
        // manager is unique in that the table is a list of boxers that they manage
        switch (role) {
            case BoxrecRole.boxer:
                boxrecProfile = new BoxrecPageProfileBoxer(boxrecPageBody);
                break;
            case BoxrecRole.judge:
            case BoxrecRole.supervisor:
            case BoxrecRole.referee:
                boxrecProfile = new BoxrecPageProfileJudgeSupervisor(boxrecPageBody);
                break;
            case BoxrecRole.doctor:
            case BoxrecRole.promoter:
            case BoxrecRole.inspector:
            case BoxrecRole.matchmaker:
                return new BoxrecPageProfileEvents(boxrecPageBody);
            case BoxrecRole.manager:
                return new BoxrecPageProfileManager(boxrecPageBody);
            default:
                throw new Error("could not match one of the `BoxrecRole`");
        }

        // this is not applicable to all roles
        // the roles that return and don't have `bouts` on their profile page will never hit this point
        if (boxrecProfile.bouts && boxrecProfile.bouts[0].hasBoxerRatings) {
            return boxrecProfile;
        }

        // calls itself with the toggle for `toggleRatings=y`
        return this.makeGetPersonByIdRequest(globalId, role, offset, true);
    }

}

module.exports = new Boxrec();
