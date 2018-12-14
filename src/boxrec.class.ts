import BoxrecRequests from "boxrec-requests";
import * as fs from "fs";
import {WriteStream} from "fs";
import {CookieJar, RequestResponse} from "request";
import * as rp from "request-promise";
import {Cookie} from "tough-cookie";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageDate} from "./boxrec-pages/date/boxrec.page.date";
import {BoxrecPageEventBout} from "./boxrec-pages/event/bout/boxrec.page.event.bout";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecLocationEventParams} from "./boxrec-pages/location/event/boxrec.location.event.constants";
import {BoxrecPageLocationEvent} from "./boxrec-pages/location/event/boxrec.page.location.event";
import {BoxrecLocationsPeopleParams,} from "./boxrec-pages/location/people/boxrec.location.people.constants";
import {BoxrecPageLocationPeople} from "./boxrec-pages/location/people/boxrec.page.location.people";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";
import {BoxrecPageProfileOtherCommon} from "./boxrec-pages/profile/boxrec.page.profile.other.common";
import {BoxrecPageProfilePromoter} from "./boxrec-pages/profile/boxrec.page.profile.promoter";
import {PersonRequestParams} from "./boxrec-pages/profile/boxrec.profile.constants";
import {BoxrecPageRatings} from "./boxrec-pages/ratings/boxrec.page.ratings";
import {BoxrecRatingsParams} from "./boxrec-pages/ratings/boxrec.ratings.constants";
import {BoxrecResultsParams} from "./boxrec-pages/results/boxrec.results.constants";
import {BoxrecPageSchedule} from "./boxrec-pages/schedule/boxrec.page.schedule";
import {BoxrecScheduleParams} from "./boxrec-pages/schedule/boxrec.schedule.constants";
import {BoxrecPageSearch} from "./boxrec-pages/search/boxrec.page.search";
import {
    BoxrecRole,
    BoxrecSearch,
    BoxrecSearchParams,
    BoxrecStatus
} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageTitle} from "./boxrec-pages/title/boxrec.page.title";
import {BoxrecTitlesParams,} from "./boxrec-pages/titles/boxrec.page.title.constants";
import {BoxrecPageTitles} from "./boxrec-pages/titles/boxrec.page.titles";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";

// https://github.com/Microsoft/TypeScript/issues/14151
if (typeof (Symbol as any).asyncIterator === "undefined") {
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");
}

class Boxrec {

    private _cookieJar: CookieJar = rp.jar();

    get cookies(): Cookie[] {
        return this._cookieJar.getCookies("http://boxrec.com");
    }

    set cookies(cookiesArr: Cookie[]) {
        this._cookieJar = rp.jar(); // reset the cookieJar
        cookiesArr.forEach(item => this._cookieJar.setCookie(item, "http://boxrec.com"));
    }

    /**
     * Makes a request to BoxRec to get information about an individual bout
     * @param {string} eventBoutId
     * @returns {Promise<BoxrecPageEventBout>}
     */
    async getBout(eventBoutId: string): Promise<BoxrecPageEventBout> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getBout(this._cookieJar, eventBoutId);

        return new BoxrecPageEventBout(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to return/save the PDF version of a boxer profile
     * @param {number} globalId     the BoxRec global id of the boxer
     * @param {string} pathToSaveTo directory to save to.  if not used will only return data
     * @param {string} fileName     file name to save as.  Will save as {globalId}.pdf as default.  Add .pdf to end of filename
     * @returns {Promise<string>}
     */
    async getBoxerPDF(globalId: number, pathToSaveTo?: string, fileName?: string): Promise<string> {
        return this.getBoxerOther(globalId, "pdf", pathToSaveTo, fileName);
    }

    /**
     * Makes a request to BoxRec to return/save the printable version of a boxer profile
     * @param {number} globalId     the BoxRec global id of the boxer
     * @param {string} pathToSaveTo directory to save to.  if not used will only return data
     * @param {string} fileName     file name to save as.  Will save as {globalId}.html as default.  Add .html to end of filename
     * @returns {Promise<string>}
     */
    async getBoxerPrint(globalId: number, pathToSaveTo?: string, fileName?: string): Promise<string> {
        return this.getBoxerOther(globalId, "print", pathToSaveTo, fileName);
    }

    /**
     * Makes a request to BoxRec to return a list of current champions
     * @returns {Promise<BoxrecPageChampions>}
     */
    async getChampions(): Promise<BoxrecPageChampions> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getChampions(this._cookieJar);

        return new BoxrecPageChampions(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get events/bouts on the particular date
     * @param {string} dateString   date to search for.  Format ex. `2012-06-07`
     * @returns {Promise<void>}
     */
    async getDate(dateString: string): Promise<BoxrecPageDate> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getDate(this._cookieJar, dateString);

        return new BoxrecPageDate(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to retrieve an event by id
     * @param {number} eventId      the event id from BoxRec
     * @returns {Promise<BoxrecPageEvent>}
     */
    async getEventById(eventId: number): Promise<BoxrecPageEvent> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] = BoxrecRequests.getEventById(this._cookieJar, eventId);

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
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getEventsByLocation(this._cookieJar, params, offset);

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
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getPeopleByLocation(this._cookieJar, params, offset);

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
     * @yields {BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager}         returns a generator to fetch the next person by ID
     */
    async* getPeopleByName(firstName: string, lastName: string, role: BoxrecRole = BoxrecRole.boxer, status: BoxrecStatus = BoxrecStatus.all, offset: number = 0): AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> {
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
     * @returns {Promise<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>}
     */
    async getPersonById(globalId: number, role: BoxrecRole = BoxrecRole.boxer, offset: number = 0): Promise<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager | BoxrecPageProfilePromoter> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getPersonById(this._cookieJar, globalId, role, offset);

        // there are 9 roles on the BoxRec website
        // the differences are that the boxers have 2 more columns `last6` for each boxer
        // the judge and others don't have those columns
        // the doctor and others have `events`
        // manager is unique in that the table is a list of boxers that they manage
        switch (role) {
            case BoxrecRole.boxer:
                return new BoxrecPageProfileBoxer(boxrecPageBody);
            case BoxrecRole.judge:
            case BoxrecRole.supervisor:
            case BoxrecRole.referee:
                return new BoxrecPageProfileOtherCommon(boxrecPageBody);
            case BoxrecRole.promoter:
                return new BoxrecPageProfilePromoter(boxrecPageBody);
            case BoxrecRole.doctor:
            case BoxrecRole.inspector:
            case BoxrecRole.matchmaker:
                return new BoxrecPageProfileEvents(boxrecPageBody);
            case BoxrecRole.manager:
                return new BoxrecPageProfileManager(boxrecPageBody);
        }

        // by default we'll use the boxer profile so at least some of the data will be returned
        return new BoxrecPageProfileBoxer(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of ratings/rankings, either P4P or by a single weight class
     * @param {BoxrecRatingsParams} params      params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageRatings>}
     */
    async getRatings(params: BoxrecRatingsParams, offset: number = 0): Promise<BoxrecPageRatings> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getRatings(this._cookieJar, params, offset);

        return new BoxrecPageRatings(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of results.
     * Uses same class
     * @param {BoxrecResultsParams} params  params included in this search
     * @param {number} offset               the number of rows to offset this search
     * @returns {Promise<BoxrecPageSchedule>}
     */
    async getResults(params: BoxrecResultsParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getResults(this._cookieJar, params, offset);

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
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getSchedule(this._cookieJar, params, offset);

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to the specific title URL to get a belt's history
     * @param {string} titleString  in the format of "6/Middleweight" which would be the WBC Middleweight title
     * @param {number} offset       the number of rows to offset the search
     * @returns {Promise<BoxrecPageTitle>}
     */
    async getTitleById(titleString: string, offset: number = 0): Promise<BoxrecPageTitle> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getTitleById(this._cookieJar, titleString, offset);

        return new BoxrecPageTitle(boxrecPageBody);
    }

    async getTitles(params: BoxrecTitlesParams, offset: number = 0): Promise<any> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getTitles(this._cookieJar, params, offset);

        return new BoxrecPageTitles(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get the information of a venue
     * @param {number} venueId
     * @param {number} offset   the number of rows to offset the search
     * @returns {Promise<BoxrecPageVenue>}
     */
    async getVenueById(venueId: number, offset: number = 0): Promise<BoxrecPageVenue> {
        this.checkIfLoggedIntoBoxRec();
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getVenueById(this._cookieJar, venueId, offset);

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
        this._cookieJar = await BoxrecRequests.login(username, password);
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
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.search(this._cookieJar, params, offset);

        return new BoxrecPageSearch(boxrecPageBody).results;
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
     * Returns/saves a boxer's profile in print/pdf format
     * @param {number} globalId
     * @param {"pdf" | "print"} type
     * @param {string} pathToSaveTo
     * @param {string} fileName
     * @returns {Promise<string>}
     */
    private async getBoxerOther(globalId: number, type: "pdf" | "print", pathToSaveTo?: string, fileName?: string): Promise<string> {
        this.checkIfLoggedIntoBoxRec();

        const qs: PersonRequestParams = {};
        let boxrecPageBody: RequestResponse["body"];

        if (type === "pdf") {
            qs.pdf = "y";
            boxrecPageBody = await BoxrecRequests.getBoxerPDF(this._cookieJar, globalId, pathToSaveTo, fileName);
        } else {
            qs.print = "y";
            boxrecPageBody = await BoxrecRequests.getBoxerPrint(this._cookieJar, globalId, pathToSaveTo, fileName);
        }

        if (pathToSaveTo) {
            let fileNameToSaveAs: string;

            if (fileName) {
                fileNameToSaveAs = fileName;
            } else {
                fileNameToSaveAs = `${globalId}.` + (type === "pdf" ? "pdf" : "html");
            }

            let updatedPathToSave: string = pathToSaveTo;

            if (updatedPathToSave.slice(-1) !== "/") {
                updatedPathToSave += "/";
            }

            const file: WriteStream = fs.createWriteStream(updatedPathToSave + fileNameToSaveAs);
            boxrecPageBody.pipe(file);
        }

        return boxrecPageBody;
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

}

export default new Boxrec();
