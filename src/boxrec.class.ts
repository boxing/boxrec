import {BoxrecRequests} from "boxrec-requests";
import * as fs from "fs";
import {WriteStream} from "fs";
import {CookieJar, RequestResponse} from "request";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageDate} from "./boxrec-pages/date/boxrec.page.date";
import {BoxrecPageEventBout} from "./boxrec-pages/event/bout/boxrec.page.event.bout";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecLocationEventParams} from "./boxrec-pages/location/event/boxrec.location.event.constants";
import {BoxrecPageLocationEvent} from "./boxrec-pages/location/event/boxrec.page.location.event";
import {BoxrecLocationsPeopleParams} from "./boxrec-pages/location/people/boxrec.location.people.constants";
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
import {BoxrecTitlesParams} from "./boxrec-pages/titles/boxrec.page.title.constants";
import {BoxrecPageTitles} from "./boxrec-pages/titles/boxrec.page.titles";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";
import {BoxrecPageWatch} from "./boxrec-pages/watch/boxrec.page.watch";
import {BoxrecPageWatchRow} from "./boxrec-pages/watch/boxrec.page.watch.row";

// https://github.com/Microsoft/TypeScript/issues/14151
if (typeof (Symbol as any).asyncIterator === "undefined") {
    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("asyncIterator");
}

export class Boxrec {

    /**
     * Makes a request to BoxRec to log the user in
     * This is required before making any additional calls
     * The session cookie is stored inside this class and lost
     * Note: credentials are sent over HTTP, BoxRec doesn't support HTTPS
     * @param {string} username     your BoxRec username
     * @param {string} password     your BoxRec password
     * @returns {Promise<void>}     If the response is undefined, you have successfully logged in.  Otherwise an error will be thrown
     */
    static async login(username: string, password: string): Promise<CookieJar> {
        return BoxrecRequests.login(username, password);
    }

    /**
     * Makes a request to BoxRec to get information about an individual bout
     * @param {jar} cookieJar
     * @param {string} eventBoutId
     * @returns {Promise<BoxrecPageEventBout>}
     */
    static async getBoutById(cookieJar: CookieJar, eventBoutId: string): Promise<BoxrecPageEventBout> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getBout(cookieJar, eventBoutId);

        return new BoxrecPageEventBout(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to return/save the PDF version of a boxer profile
     * @param {jar} cookieJar
     * @param {number} globalId     the BoxRec global id of the boxer
     * @param {string} pathToSaveTo directory to save to.  if not used will only return data
     * @param {string} fileName     file name to save as.  Will save as {globalId}.pdf as default.  Add .pdf to end of filename
     * @returns {Promise<string>}
     */
    static async getBoxerPDF(cookieJar: CookieJar, globalId: number, pathToSaveTo?: string, fileName?: string): Promise<string> {
        return this.getBoxerOther(cookieJar, globalId, "pdf", pathToSaveTo, fileName);
    }

    /**
     * Makes a request to BoxRec to return/save the printable version of a boxer profile
     * @param {jar} cookieJar
     * @param {number} globalId     the BoxRec global id of the boxer
     * @param {string} pathToSaveTo directory to save to.  if not used will only return data
     * @param {string} fileName     file name to save as.  Will save as {globalId}.html as default.  Add .html to end of filename
     * @returns {Promise<string>}
     */
    static async getBoxerPrint(cookieJar: CookieJar, globalId: number, pathToSaveTo?: string, fileName?: string): Promise<string> {
        return this.getBoxerOther(cookieJar, globalId, "print", pathToSaveTo, fileName);
    }

    /**
     * Makes a request to BoxRec to return a list of current champions
     * @param {jar} cookieJar
     * @returns {Promise<BoxrecPageChampions>}
     */
    static async getChampions(cookieJar: CookieJar): Promise<BoxrecPageChampions> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getChampions(cookieJar);

        return new BoxrecPageChampions(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get events/bouts on the particular date
     * @param {jar} cookieJar
     * @param {string} dateString   date to search for.  Format ex. `2012-06-07`
     * @returns {Promise<void>}
     */
    static async getDate(cookieJar: CookieJar, dateString: string): Promise<BoxrecPageDate> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getDate(cookieJar, dateString);

        return new BoxrecPageDate(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to retrieve an event by id
     * @param {jar} cookieJar
     * @param {number} eventId      the event id from BoxRec
     * @returns {Promise<BoxrecPageEvent>}
     */
    static async getEventById(cookieJar: CookieJar, eventId: number): Promise<BoxrecPageEvent> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getEventById(cookieJar, eventId);

        return new BoxrecPageEvent(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to list events by location
     * @param {jar} cookieJar
     * @param {BoxrecLocationEventParams} params    params included in this search
     * @param {number} offset                       the number of rows to offset the search
     * @returns {Promise<BoxrecPageLocationEvent>}
     */
    static async getEventsByLocation(cookieJar: CookieJar, params: BoxrecLocationEventParams, offset: number = 0): Promise<BoxrecPageLocationEvent> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getEventsByLocation(cookieJar, params, offset);

        return new BoxrecPageLocationEvent(boxrecPageBody);
    }

    /**
     * Make a request to BoxRec to search for people by location
     * @param {jar} cookieJar
     * @param {BoxrecLocationsPeopleParams} params  params included in this search
     * @param {number} offset                       the number of rows to offset the search
     * @returns {Promise<BoxrecPageLocationPeople>}
     */
    static async getPeopleByLocation(cookieJar: CookieJar, params: BoxrecLocationsPeopleParams, offset: number = 0):
        Promise<BoxrecPageLocationPeople> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getPeopleByLocation(cookieJar, params, offset);

        return new BoxrecPageLocationPeople(boxrecPageBody);
    }

    /**
     * Make a request to BoxRec to get a person by their BoxRec Global ID
     * @param {jar} cookieJar
     * @param {number} globalId                 the BoxRec profile id
     * @param {BoxrecRole} role                 the role of the person in boxing (there seems to be multiple profiles for people if they fall under different roles)
     * @param {number} offset                   offset number of bouts/events in the profile.  Not used for boxers as boxer's profiles list all bouts they've been in
     * @returns {Promise<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>}
     */
    static async getPersonById(cookieJar: CookieJar, globalId: number, role: BoxrecRole = BoxrecRole.boxer, offset: number = 0):
        Promise<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager | BoxrecPageProfilePromoter> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getPersonById(cookieJar, globalId, role, offset);

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
     * @param {jar} cookieJar
     * @param {BoxrecRatingsParams} params      params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageRatings>}
     */
    static async getRatings(cookieJar: CookieJar, params: BoxrecRatingsParams, offset: number = 0): Promise<BoxrecPageRatings> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getRatings(cookieJar, params, offset);

        return new BoxrecPageRatings(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of results.
     * Uses same class
     * @param {jar} cookieJar
     * @param {BoxrecResultsParams} params  params included in this search
     * @param {number} offset               the number of rows to offset this search
     * @returns {Promise<BoxrecPageSchedule>}
     */
    static async getResults(cookieJar: CookieJar, params: BoxrecResultsParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getResults(cookieJar, params, offset);

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of scheduled events
     * @param {jar} cookieJar
     * @param {BoxrecScheduleParams} params     params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageSchedule>}
     */
    static async getSchedule(cookieJar: CookieJar, params: BoxrecScheduleParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getSchedule(cookieJar, params, offset);

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to the specific title URL to get a belt's history
     * @param {jar} cookieJar
     * @param {string} titleString  in the format of "6/Middleweight" which would be the WBC Middleweight title
     * @param {number} offset       the number of rows to offset the search
     * @returns {Promise<BoxrecPageTitle>}
     */
    static async getTitleById(cookieJar: CookieJar, titleString: string, offset: number = 0): Promise<BoxrecPageTitle> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getTitleById(cookieJar, titleString, offset);

        return new BoxrecPageTitle(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to return scheduled and previous bouts in regards to a belt/division
     * @param {jar} cookieJar
     * @param {BoxrecTitlesParams} params
     * @param {number} offset
     * @returns {Promise<any>}
     */
    static async getTitles(cookieJar: CookieJar, params: BoxrecTitlesParams, offset: number = 0): Promise<any> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getTitles(cookieJar, params, offset);

        return new BoxrecPageTitles(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get the information of a venue
     * @param {jar} cookieJar
     * @param {number} venueId
     * @param {number} offset   the number of rows to offset the search
     * @returns {Promise<BoxrecPageVenue>}
     */
    static async getVenueById(cookieJar: CookieJar, venueId: number, offset: number = 0): Promise<BoxrecPageVenue> {
        const boxrecPageBody: RequestResponse["body"] =
            await BoxrecRequests.getVenueById(cookieJar, venueId, offset);

        return new BoxrecPageVenue(boxrecPageBody);
    }

    /**
     * Lists all boxers that are watched by the user
     * @param {jar} cookieJar
     * @returns {Promise<BoxrecPageWatchRow>}
     */
    static async getWatched(cookieJar: CookieJar): Promise<BoxrecPageWatchRow[]> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.getWatched(cookieJar);
        
        return new BoxrecPageWatch(boxrecPageBody).list;
    }

    /**
     * Makes a request to BoxRec to search people by
     * Note: currently only supports boxers
     * @param {jar} cookieJar
     * @param {BoxrecSearchParams} params   params included in this search
     * @param {number}             offset   the number of rows to offset the search
     * @returns {Promise<BoxrecSearch[]>}
     */
    static async search(cookieJar: CookieJar, params: BoxrecSearchParams, offset: number = 0): Promise<BoxrecSearch[]> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.search(cookieJar, params, offset);

        return new BoxrecPageSearch(boxrecPageBody).results;
    }

    /**
     * Removes the boxer from the users watch list, returns true if they were successfully removed
     * @param {jar} cookieJar
     * @param {number} boxerGlobalId
     * @returns {Promise<boolean>}
     */
    static async unwatch(cookieJar: CookieJar, boxerGlobalId: number): Promise<boolean> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.unwatch(cookieJar, boxerGlobalId);
        const isBoxerInList: boolean = new BoxrecPageWatch(boxrecPageBody).checkForBoxerInList(boxerGlobalId);

        if (isBoxerInList) {
            throw new Error("Boxer appears in list after being removed");
        }

        return !isBoxerInList;
    }

    /**
     * Adds the boxer to the users watch list, returns true if they were successfully added to the list
     * @param {jar} cookieJar
     * @param {number} boxerGlobalId
     * @returns {Promise<boolean>}
     */
    static async watch(cookieJar: CookieJar, boxerGlobalId: number): Promise<boolean> {
        const boxrecPageBody: RequestResponse["body"] = await BoxrecRequests.watch(cookieJar, boxerGlobalId);
        const isBoxerInList: boolean = new BoxrecPageWatch(boxrecPageBody).checkForBoxerInList(boxerGlobalId);

        if (!isBoxerInList) {
            throw new Error("Boxer did not appear in list after being added");
        }

        return isBoxerInList;
    }

    /**
     * Returns/saves a boxer's profile in print/pdf format
     * @param {jar} cookieJar
     * @param {number} globalId
     * @param {"pdf" | "print"} type
     * @param {string} pathToSaveTo
     * @param {string} fileName
     * @returns {Promise<string>}
     */
    private static async getBoxerOther(cookieJar: CookieJar, globalId: number, type: "pdf" | "print", pathToSaveTo?: string, fileName?: string): Promise<string> {
        const qs: PersonRequestParams = {};
        let boxrecPageBody: RequestResponse["body"];

        if (type === "pdf") {
            qs.pdf = "y";
            boxrecPageBody = await BoxrecRequests.getBoxerPDF(cookieJar, globalId, pathToSaveTo, fileName);
        } else {
            qs.print = "y";
            boxrecPageBody = await BoxrecRequests.getBoxerPrint(cookieJar, globalId, pathToSaveTo, fileName);
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
     * Makes a search request to BoxRec to get all people that match that name
     * by using a generator, we're able to prevent making too many calls to BoxRec
     * @param {jar} cookieJar
     * @param {string} firstName            the person's first name
     * @param {string} lastName             the person's last name
     * @param {string} role                 the role of the person
     * @param {BoxrecStatus} status         whether the person is active in Boxing or not
     * @param {number} offset               the number of rows to offset the search
     * @yields {BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager}         returns a generator to fetch the next person by ID
     */
    static async* getPeopleByName(cookieJar: CookieJar, firstName: string, lastName: string, role: BoxrecRole = BoxrecRole.boxer, status: BoxrecStatus = BoxrecStatus.all, offset: number = 0):
        AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> {
        const params: BoxrecSearchParams = {
            first_name: firstName,
            last_name: lastName,
            role,
            status,
        };
        const searchResults: RequestResponse["body"] = await Boxrec.search(cookieJar, params, offset);

        for (const result of searchResults) {
            yield await Boxrec.getPersonById(cookieJar, result.id);
        }
    }

}
