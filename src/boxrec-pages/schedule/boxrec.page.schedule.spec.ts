import {mockScheduleWorldwide} from "boxrec-mocks";
import {BoxrecPageEvent} from "../event/boxrec.page.event";
import {BoxrecPageSchedule} from "./boxrec.page.schedule";

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeStringOrNull(): R;
        }
    }
}

expect.extend({
    toBeStringOrNull(received): { message: () => string, pass: boolean } {
        if (received === null || typeof received === "string") {
            return {
                message: () => "is valid",
                pass: true,
            };
        }

        return {
            message: () => "is not valid",
            pass: false,
        };
    }
});

describe("class BoxrecPageSchedule", () => {

    let events: BoxrecPageSchedule;

    beforeAll(() => {
        events = new BoxrecPageSchedule(mockScheduleWorldwide);
    });

    describe("getter output", () => {

        describe("getter numberOfPages", () => {

            it("should return the number of pages", () => {
                expect(events.output.numberOfPages).toBeGreaterThanOrEqual(1);
            });

        });

        describe("getter events", () => {

            it("should return an array of search results", () => {
                expect(events.output.events.length).toBeGreaterThan(0);
            });

            describe("event values", () => {

                let event: BoxrecPageEvent;

                beforeAll(() => {
                    const eventsArr: BoxrecPageEvent[] = events.output.events;
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
                        expect(event.location.location.country).toEqual({
                            id: jasmine.any(String),
                            name: jasmine.any(String),
                        });
                    });

                    it("should return the region", () => {
                        expect(event.location.location.region.id).toBeStringOrNull();
                        expect(event.location.location.region.name).toBeStringOrNull();
                    });

                    it("should return the town which can be a string or null", () => {
                        expect(event.location.location.town).toBeDefined();
                    });

                });

            });

        });

    });
});
