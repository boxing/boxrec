import * as fs from "fs";
import {boxRecMocksModulePath} from "../boxrec.constants";
import {BoxrecPageEvent} from "../event/boxrec.page.event";
import {BoxrecPageSchedule} from "./boxrec.page.schedule";

const mockSearchResults: string = fs.readFileSync(`${boxRecMocksModulePath}/schedule/mockScheduleWorldwide.html`, "utf8");

describe("class BoxrecPageSchedule", () => {

    let events: BoxrecPageSchedule;

    beforeAll(() => {
        events = new BoxrecPageSchedule(mockSearchResults);
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
                    expect(event.location.location.country).not.toBeUndefined();
                });

                it("should return the region", () => {
                    // there's the possibility this is `null`
                    expect(event.location.location.region).not.toBeUndefined();
                });

                it("should return the town", () => {
                    expect(event.location.location.town).not.toBeUndefined();
                });

            });

        });

    });

});
