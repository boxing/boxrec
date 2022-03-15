import {mockScheduleWorldwide} from "boxrec-mocks";
import {WeightDivision} from "boxrec-requests";
import {BoxrecEventOutput} from "../event/boxrec.event.constants";
import {BoxrecPageSchedule} from "./boxrec.page.schedule";

interface ExtendedMatchers extends jest.Matchers<void> {
    toBeStringOrNull: () => () => boolean;
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

                let event: BoxrecEventOutput;

                beforeAll(() => {
                    const eventsArr: BoxrecEventOutput[] = events.output.events;
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
                        (expect(event.location.location.region.id) as ExtendedMatchers).toBeStringOrNull();
                        (expect(event.location.location.region.name) as ExtendedMatchers).toBeStringOrNull();
                    });

                    it("should return the town which can be a string or null", () => {
                        expect(event.location.location.town).toBeDefined();
                    });

                });

                describe("getter bouts", () => {

                    describe("getter firstBoxer", () => {

                        it("should not return null values", () => {
                            expect(event.bouts[0].firstBoxer).toEqual({
                                id: jasmine.any(Number),
                                name: jasmine.any(String),
                            });
                        });

                    });

                    describe("getter division", () => {

                        it("should return the division of the bout", () => {
                            expect(Object.values(WeightDivision)).toContain(event.bouts[0].division);
                        });

                    });

                    describe("getter rating", () => {

                        it("should return a value of 0 or greater", () => {
                            expect(event.bouts[0].rating).toBeGreaterThanOrEqual(0);
                        });

                    });

                });

            });

        });

    });
});
