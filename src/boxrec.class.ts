import {BoxrecRequests, BoxrecDate} from "boxrec-requests";
import {
    BoxrecLocationEventParams,
    BoxrecLocationsPeopleParams,
    BoxrecRole
} from "boxrec-requests";
import * as fs from "fs";
import {WriteStream} from "fs";
import {BoxrecPageChampions} from "./boxrec-pages/champions/boxrec.page.champions";
import {BoxrecPageDate} from "./boxrec-pages/date/boxrec.page.date";
import {BoxrecPageEventBout} from "./boxrec-pages/event/bout/boxrec.page.event.bout";
import {BoxrecPageEvent} from "./boxrec-pages/event/boxrec.page.event";
import {BoxrecPageLocationEvent} from "./boxrec-pages/location/event/boxrec.page.location.event";
import {BoxrecPageLocationBoxer} from "./boxrec-pages/location/people/boxrec.page.location.boxer";
import {BoxrecPageLocationPeople} from "./boxrec-pages/location/people/boxrec.page.location.people";
import {BoxrecPageProfileBoxer} from "./boxrec-pages/profile/boxrec.page.profile.boxer";
import {BoxrecPageProfileEvents} from "./boxrec-pages/profile/boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec-pages/profile/boxrec.page.profile.manager";
import {BoxrecPageProfileOtherCommon} from "./boxrec-pages/profile/boxrec.page.profile.other.common";
import {BoxrecPageProfilePromoter} from "./boxrec-pages/profile/boxrec.page.profile.promoter";
import {BoxrecPageRatings} from "./boxrec-pages/ratings/boxrec.page.ratings";
import {BoxrecRatingsParams} from "./boxrec-pages/ratings/boxrec.ratings.constants";
import {BoxrecResultsParams} from "./boxrec-pages/results/boxrec.results.constants";
import {BoxrecPageSchedule} from "./boxrec-pages/schedule/boxrec.page.schedule";
import {BoxrecScheduleParams} from "./boxrec-pages/schedule/boxrec.schedule.constants";
import {BoxrecPageSearch} from "./boxrec-pages/search/boxrec.page.search";
import {BoxrecSearch, BoxrecSearchParams, BoxrecStatus} from "./boxrec-pages/search/boxrec.search.constants";
import {BoxrecPageTitle} from "./boxrec-pages/title/boxrec.page.title";
import {BoxrecTitlesParams} from "./boxrec-pages/titles/boxrec.page.title.constants";
import {BoxrecPageTitles} from "./boxrec-pages/titles/boxrec.page.titles";
import {BoxrecPageVenue} from "./boxrec-pages/venue/boxrec.page.venue";
import {BoxrecPageWatch} from "./boxrec-pages/watch/boxrec.page.watch";
import {BoxrecPageWatchRow} from "./boxrec-pages/watch/boxrec.page.watch.row";

// https://github.com/Microsoft/TypeScript/issues/14151
if (typeof (Symbol as any).asyncIterator === "undefined") {
    (Symbol as any).asyncIterator = Symbol("asyncIterator");
}

export class Boxrec {

    /**
     * Makes a request to BoxRec to log the user in
     * This is required before making any additional calls
     * The session cookie is stored inside this class and lost
     * Note: credentials are sent over HTTP, BoxRec doesn't support HTTPS
     * @param {string} username     your BoxRec username
     * @param {string} password     your BoxRec password
     * @returns {Promise<string>}    the BoxRec log in cookie to make subsequent requests
     *
     */
    static async login(username: string, password: string): Promise<string> {
        return BoxrecRequests.login(username, password);
    }

    /**
     * Makes a request to BoxRec to get information about an individual bout
     * @param {string} cookies
     * @param {string} eventBoutId
     * @returns {Promise<BoxrecPageEventBout>}
     */
    static async getBoutById(cookies: string, eventBoutId: string): Promise<BoxrecPageEventBout> {
        const boxrecPageBody: string = await BoxrecRequests.getBout(cookies, eventBoutId);

        return new BoxrecPageEventBout(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to return/save the PDF version of a boxer profile
     * @param {string} cookies
     * @param {number} globalId     the BoxRec global id of the boxer
     * @param {string} pathToSaveTo directory to save to.  if not used will only return data
     * @param {string} fileName     file name to save as.  Will save as {globalId}.pdf as default.  Add .pdf to end of filename
     * @returns {Promise<string>}
     */
    static async getBoxerPDF(cookies: string, globalId: number, pathToSaveTo?: string, fileName?: string): Promise<string> {
        return this.getBoxerOther(cookies, globalId, "pdf", pathToSaveTo, fileName);
    }

    /**
     * Makes a request to BoxRec to return/save the printable version of a boxer profile
     * @param {string} cookies
     * @param {number} globalId     the BoxRec global id of the boxer
     * @param {string} pathToSaveTo directory to save to.  if not used will only return data
     * @param {string} fileName     file name to save as.  Will save as {globalId}.html as default.  Add .html to end of filename
     * @returns {Promise<string>}
     */
    static async getBoxerPrint(cookies: string, globalId: number, pathToSaveTo?: string, fileName?: string): Promise<string> {
        return this.getBoxerOther(cookies, globalId, "print", pathToSaveTo, fileName);
    }

    /**
     * Makes a request to BoxRec to return a list of current champions
     * @param {string} cookies
     * @returns {Promise<BoxrecPageChampions>}
     */
    static async getChampions(cookies: string): Promise<BoxrecPageChampions> {
        const boxrecPageBody: string = await BoxrecRequests.getChampions(cookies);

        return new BoxrecPageChampions(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get events/bouts on the particular date
     * @param {string} cookies
     * @param {BoxrecDate} params
     * @returns {Promise<void>}
     */
    static async getDate(cookies: string, params: BoxrecDate): Promise<BoxrecPageDate> {
        const boxrecPageBody: string = await BoxrecRequests.getDate(cookies, params);

        return new BoxrecPageDate(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to retrieve an event by id
     * @param {string} cookies
     * @param {number} eventId      the event id from BoxRec
     * @returns {Promise<BoxrecPageEvent>}
     */
    static async getEventById(cookies: string, eventId: number): Promise<BoxrecPageEvent> {
        const boxrecPageBody: string = await BoxrecRequests.getEventById(cookies, eventId);

        return new BoxrecPageEvent(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to list events by location
     * @param {string} cookies
     * @param {BoxrecLocationEventParams} params    params included in this search
     * @param {BoxrecLocationEventParams.sport} params.sports   if this is not a valid option, will send strange results
     * @param {number} offset                       the number of rows to offset the search
     * @returns {Promise<BoxrecPageLocationEvent>}
     */
    static async getEventsByLocation(cookies: string, params: BoxrecLocationEventParams, offset: number = 0): Promise<BoxrecPageLocationEvent> {
        const boxrecPageBody: string =
            await BoxrecRequests.getEvents(cookies, params, offset);

        return new BoxrecPageLocationEvent(boxrecPageBody);
    }

    /**
     * Make a request to BoxRec to search for people by location
     * @param {string} cookies
     * @param {BoxrecLocationsPeopleParams} params  params included in this search
     * @param {number} offset                       the number of rows to offset the search
     * @returns {Promise<BoxrecPageLocationPeople>}
     */
    static async getPeopleByLocation(cookies: string, params: BoxrecLocationsPeopleParams, offset: number = 0):
        Promise<BoxrecPageLocationPeople | BoxrecPageLocationBoxer> {
        const boxrecPageBody: string =
            await BoxrecRequests.getPeople(cookies, params, offset);

        if (params.role === BoxrecRole.proBoxer) {
            return new BoxrecPageLocationBoxer(boxrecPageBody);
        }

        return new BoxrecPageLocationPeople(boxrecPageBody);
    }

    /**
     * Make a request to BoxRec to get a person by their BoxRec Global ID
     * @param {string} cookies
     * @param {number} globalId     the BoxRec profile id
     * @param {BoxrecRole} role     the role of the person in boxing (there seems to be multiple profiles for people if they fall under different roles)
     * @param {number} offset       offset number of bouts/events in the profile
     *                              We offset by number and not pages because the number of bouts per page may change
     * @returns {Promise<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager>}
     */
    static async getPersonById(cookies: string, globalId: number, role: BoxrecRole | null = null,
                               offset: number = 0):
        Promise<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents |
            BoxrecPageProfileManager | BoxrecPageProfilePromoter> {
        const boxrecPageBody: string = await BoxrecRequests.getPersonById(cookies, globalId,
            role, offset);

        // there are 9 roles on the BoxRec website
        // the differences are that the boxers have 2 more columns `last6` for each boxer
        // the judge and others don't have those columns
        // the doctor and others have `events`
        // manager is unique in that the table is a list of boxers that they manage
        switch (role) {
            case BoxrecRole.proBoxer:
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
            // todo we should be able to figure out the default role if one was not specified and use the correct class
        }

        // by default we'll use the boxer profile so at least some of the data will be returned
        return new BoxrecPageProfileBoxer(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of ratings/rankings, either P4P or by a single weight class
     * @param {string} cookies
     * @param {BoxrecRatingsParams} params      params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageRatings>}
     */
    static async getRatings(cookies: string, params: BoxrecRatingsParams, offset: number = 0): Promise<BoxrecPageRatings> {
        const boxrecPageBody: string =
            await BoxrecRequests.getRatings(cookies, params, offset);

        return new BoxrecPageRatings(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of results.
     * Uses same class
     * @param {string} cookies
     * @param {BoxrecResultsParams} params  params included in this search
     * @param {number} offset               the number of rows to offset this search
     * @returns {Promise<BoxrecPageSchedule>}
     */
    static async getResults(cookies: string, params: BoxrecResultsParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        const boxrecPageBody: string =
            await BoxrecRequests.getResults(cookies, params, offset);

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get a list of scheduled events
     * @param {string} cookies
     * @param {BoxrecScheduleParams} params     params included in this search
     * @param {number} offset                   the number of rows to offset the search
     * @returns {Promise<BoxrecPageSchedule>}
     */
    static async getSchedule(cookies: string, params: BoxrecScheduleParams, offset: number = 0): Promise<BoxrecPageSchedule> {
        const boxrecPageBody: string =
            await BoxrecRequests.getSchedule(cookies, params, offset);

        return new BoxrecPageSchedule(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to the specific title URL to get a belt's history
     * @param {string} cookies
     * @param {string} titleString  in the format of "6/Middleweight" which would be the WBC Middleweight title
     * @param {number} offset       the number of rows to offset the search
     * @returns {Promise<BoxrecPageTitle>}
     */
    static async getTitleById(cookies: string, titleString: string, offset: number = 0): Promise<BoxrecPageTitle> {
        const boxrecPageBody: string =
            await BoxrecRequests.getTitleById(cookies, titleString, offset);

        return new BoxrecPageTitle(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to return scheduled and previous bouts in regards to a belt/division
     * @param {string} cookies
     * @param {BoxrecTitlesParams} params
     * @param {number} offset
     * @returns {Promise<any>}
     */
    static async getTitles(cookies: string, params: BoxrecTitlesParams, offset: number = 0): Promise<any> {
        const boxrecPageBody: string = await BoxrecRequests.getTitles(cookies, params, offset);

        return new BoxrecPageTitles(boxrecPageBody);
    }

    /**
     * Makes a request to BoxRec to get the information of a venue
     * @param {string} cookies
     * @param {number} venueId
     * @param {number} offset   the number of rows to offset the search
     * @returns {Promise<BoxrecPageVenue>}
     */
    static async getVenueById(cookies: string, venueId: number, offset: number = 0): Promise<BoxrecPageVenue> {
        const boxrecPageBody: string =
            await BoxrecRequests.getVenueById(cookies, venueId, offset);

        return new BoxrecPageVenue(boxrecPageBody);
    }

    /**
     * Lists all boxers that are watched by the user
     * @param {string} cookies
     * @returns {Promise<BoxrecPageWatchRow>}
     */
    static async getWatched(cookies: string): Promise<BoxrecPageWatchRow[]> {
        const boxrecPageBody: string = await BoxrecRequests.getWatched(cookies);

        return new BoxrecPageWatch(boxrecPageBody).list;
    }

    /**
     * Makes a request to BoxRec to search people by name, role and if they are active
     * Note: currently only supports boxers
     * @param {string} cookies
     * @param {BoxrecSearchParams} params   params included in this search
     * @param {number}             offset   the number of rows to offset the search
     * @returns {Promise<BoxrecSearch[]>}
     */
    static async search(cookies: string, params: BoxrecSearchParams, offset: number = 0): Promise<BoxrecSearch[]> {
        const boxrecPageBody: string = await BoxrecRequests.search(cookies, params, offset);

        return new BoxrecPageSearch(boxrecPageBody).results;
    }

    /**
     * Removes the boxer from the users watch list, returns true if they were successfully removed
     * @param {string} cookies
     * @param {number} boxerGlobalId
     * @returns {Promise<boolean>}
     */
    static async unwatch(cookies: string, boxerGlobalId: number): Promise<boolean> {
        const boxrecPageBody: string = await BoxrecRequests.unwatch(cookies, boxerGlobalId);
        const isBoxerInList: boolean = new BoxrecPageWatch(boxrecPageBody).checkForBoxerInList(boxerGlobalId);

        if (isBoxerInList) {
            throw new Error("Boxer appears in list after being removed");
        }

        return !isBoxerInList;
    }

    /**
     * Adds the boxer to the users watch list, returns true if they were successfully added to the list
     * @param {string} cookies
     * @param {number} boxerGlobalId
     * @returns {Promise<boolean>}
     */
    static async watch(cookies: string, boxerGlobalId: number): Promise<boolean> {
        const boxrecPageBody: string = await BoxrecRequests.watch(cookies, boxerGlobalId);
        const isBoxerInList: boolean = new BoxrecPageWatch(boxrecPageBody).checkForBoxerInList(boxerGlobalId);

        if (!isBoxerInList) {
            throw new Error("Boxer did not appear in list after being added");
        }

        return isBoxerInList;
    }

    /**
     * Makes a search request to BoxRec to get all people that match that name
     * by using a generator, we're able to prevent making too many calls to BoxRec
     * @param {string} cookies
     * @param {string} firstName            the person's first name
     * @param {string} lastName             the person's last name
     * @param {string} role                 the role of the person
     * @param {BoxrecStatus} status         whether the person is active in Boxing or not
     * @param {number} offset               the number of rows to offset the search
     * @yields {BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager}         returns a generator to fetch the next person by ID
     */
    // todo remove async
    static async* getPeopleByName(cookies: string, firstName: string, lastName: string,
                                  role: BoxrecRole = BoxrecRole.proBoxer, status: BoxrecStatus = BoxrecStatus.all,
                                  offset: number = 0):
        AsyncIterableIterator<BoxrecPageProfileBoxer | BoxrecPageProfileOtherCommon | BoxrecPageProfileEvents | BoxrecPageProfileManager> {
        const params: BoxrecSearchParams = {
            first_name: firstName,
            last_name: lastName,
            role,
            status,
        };
        const searchResults: BoxrecSearch[] = await Boxrec.search(cookies, params, offset);

        for (const result of searchResults) {
            yield await Boxrec.getPersonById(cookies, result.id);
        }
    }

    /**
     * Returns/saves a boxer's profile in print/pdf format
     * @param {string} cookies
     * @param {number} globalId
     * @param {"pdf" | "print"} type
     * @param {string} pathToSaveTo
     * @param {string} fileName
     * @returns {Promise<string>}
     */
    private static async getBoxerOther(cookies: string, globalId: number, type: "pdf" | "print", pathToSaveTo?: string, fileName?: string): Promise<string> {
        let boxrecPageBody: string;

        if (type === "pdf") {
            boxrecPageBody = await BoxrecRequests.getBoxerPDF(cookies, globalId);
        } else {
            boxrecPageBody = await BoxrecRequests.getBoxerPrint(cookies, globalId);
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
            file.write(boxrecPageBody);
            file.end();
        }

        return boxrecPageBody;
    }

}
