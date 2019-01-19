import {mockScheduleWorldwide} from "boxrec-mocks";
import {BoxrecPageEvent} from "../event/boxrec.page.event";
import {BoxrecPageSchedule} from "./boxrec.page.schedule";

describe("class BoxrecPageSchedule", () => {

    let events: BoxrecPageSchedule;

    beforeAll(() => {
        events = new BoxrecPageSchedule(mockScheduleWorldwide);
    });

    describe("getter events", () => {

        it("should return an array of search results", () => {
            expect(events.events.length).toBeGreaterThan(0);
        });

        describe("event values", () => {

            let event: BoxrecPageEvent;

            beforeAll(() => {
                const eventsArr: BoxrecPageEvent[] = events.events;
                event = eventsArr[Math.floor(Math.random() * eventsArr.length)];
            });

            describe("getter date", () => {

                it("should have a date", () => {
                    expect(event.date).toMatch(/\d{4}-\d{2}-\d{2}/);
                });

            });

            describe("getter inspector", () => {

                it("should not be an array, there is only one inspector", () => {
                    expect(event.inspector.id).toBeDefined();
                    expect(event.inspector.name).toBeDefined();
                });

            });

            describe("getter venue", () => {

                it("should include the id", () => {
                    expect(event.location.venue.id).not.toBeNull();
                });

                it("should include the name", () => {
                    expect(event.location.venue.name).not.toBeNull();
                });

            });

            describe("getter location", () => {

                it("should return the country", () => {
                    expect(event.location.location.country).toBeDefined();
                });

                it("should return the region", () => {
                    // there's the possibility this is `null`
                    expect(event.location.location.region).toBeDefined();
                });

                it("should return the town which can be a string or null", () => {
                    expect(event.location.location.town).toBeDefined();
                });

            });

        });

    });

});
