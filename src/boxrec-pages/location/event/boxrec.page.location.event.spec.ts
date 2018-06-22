import {boxRecMocksModulePath} from "../../boxrec.constants";
import * as fs from "fs";
import {BoxrecPageLocationEvent} from "./boxrec.page.location.event";

const mockLocationEvents: string = fs.readFileSync(`${boxRecMocksModulePath}/location/mockEventsLondon2017.html`, "utf8");

describe("class BoxrecPageLocationEvent", () => {

    let events: BoxrecPageLocationEvent;

    beforeAll(() => {
        events = new BoxrecPageLocationEvent(mockLocationEvents);
    });

    describe("getter events", () => {

        it("should return an array of location data", () => {
            expect(events.events.length).toBeGreaterThan(0);
        });

        it("should include the date", () => {
            expect(events.events[0].date).toBe("2017-12-13");
        });

        it("should include the day of the fight", () => {
            expect(events.events[0].day).toBe("Wed");
        });

        it("should include the venue", () => {
            expect(events.events[0].venue.id).toBe(28315);
            expect(events.events[0].venue.name).toBe("York Hall");
        });

        describe("getter location", () => {

            it("should include the country", () => {
                expect(events.events[0].location.country).toBe("UK");
            });

            it("should include the region", () => {
                expect(events.events[0].location.region).toBe("LON");
            });

            it("should include the town", () => {
                expect(events.events[0].location.town).toBe("Bethnal Green");
            });

        });

        it("should include the event id as id", () => {
            expect(events.events[0].id).toBe(759641);
        });

    });

});
