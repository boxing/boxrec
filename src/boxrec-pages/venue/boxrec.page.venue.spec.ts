import {mockVenueMGMGrand} from "boxrec-mocks";
import {BoxrecPageVenue} from "./boxrec.page.venue";
import {BoxrecPageVenueEventsRow} from "./boxrec.page.venue.events.row";

describe("class BoxrecPageVenue", () => {

    let mgmGrand: BoxrecPageVenue;

    beforeAll(() => {
        mgmGrand = new BoxrecPageVenue(mockVenueMGMGrand);
    });

    describe("getter output", () => {

        describe("name", () => {

            it("should have the name of the venue", () => {
                expect(mgmGrand.output.name).toBe("MGM Grand");
            });

        });

        describe("location", () => {

            it("should have the town of the location", () => {
                expect(mgmGrand.output.location.town).toEqual({
                    id: 20388,
                    name: "Las Vegas",
                });
            });

        });

        describe("localBoxers", () => {

            it("should return an array of boxers", () => {
                expect(mgmGrand.output.localBoxers[0].id).toBeGreaterThan(0);
                expect(mgmGrand.output.localBoxers[0].name.length).toBeGreaterThan(0);
            });

        });

        describe("localManagers", () => {

            it("should return an array of boxers", () => {
                expect(mgmGrand.output.localManagers[0].id).toBeGreaterThan(0);
                expect(mgmGrand.output.localManagers[0].name.length).toBeGreaterThan(0);
            });

        });

        describe("events", () => {

            let events: BoxrecPageVenueEventsRow[] = [];

            beforeAll(() => {
                events = mgmGrand.output.events;
            });

            it("should include the date of events", () => {
                events.forEach(item => expect(item.date).toMatch(/\d{4}-\d{2}-\d{2}/));
            });

            it("should return the day of the week that the event occurred", () => {
                events.forEach(item => expect(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).toContain(item.day));
            });

            it("should include the event id as id", () => {
                // `512788` was the last one of the first page, check for one's greater than `512787`
                // In case for some reason ID's change, this test should catch it
                events.forEach(item => expect(item.id).toBeGreaterThan(512787));
            });
        });
    });
});
