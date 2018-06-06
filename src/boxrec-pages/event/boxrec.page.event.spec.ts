import * as fs from "fs";
import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageEvent} from "./boxrec.page.event";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

const mockEvent: string = fs.readFileSync(`${boxRecMocksModulePath}/events/mockEventPage.html`, "utf8");

describe("class BoxrecPageEvent", () => {

    let event: BoxrecPageEvent;

    beforeAll(() => {
        event = new BoxrecPageEvent(mockEvent);
    });

    describe("getter date", () => {

        it("should return the date of the event", () => {
            expect(event.date).toBe("2018-05-05");
        });

    });

    describe("getter location", () => {

        describe("location", () => {

            it("should return the town", () => {
                expect(event.location.location.town).toBe("Greenwich");
            });

            it("should return the region", () => {
                expect(event.location.location.region).toBe("London");
            });

            it("should return the country", () => {
                expect(event.location.location.country).toBe("United Kingdom");
            });

            it("should return the id", () => {
                expect(event.location.location.id).toBe(15965);
            });

        });

        describe("venue", () => {

            it("should return the venue id", () => {
                expect(event.location.venue.id).toBe(28476);
            });

            it("should return the venue name", () => {
                expect(event.location.venue.name).toBe("O2 Arena (Millenium Dome)");
            });

        });

    });

    describe("getter commission", () => {

        it("should return the commission", () => {
            expect(event.commission).toBe("British Boxing Board of Control");
        });

    });

    describe("getter promoter", () => {

        it("should list the promoter(s)", () => {
            expect(event.promoter[0].company).toBe("Hayemaker Promotions");
            expect(event.promoter[0].id).toBe(550318);
            expect(event.promoter[0].name).toBe("David Haye");

            expect(event.promoter[1].company).toBe("Matchroom Boxing");
            expect(event.promoter[1].id).toBe(596434);
            expect(event.promoter[1].name).toBe("Eddie Hearn");
        });

    });

    describe("getter matchmaker", () => {

        it("should return the matchmaker", () => {
            expect(event.matchmaker[0].id).toBe(809320);
            expect(event.matchmaker[0].name).toBe("Paul Ready");
        });

    });

    describe("getter television", () => {

        it("should return an array of broadcasters", () => {
            expect(event.television).toContain("United Kingdom SKY Box Office");
        });

    });

    describe("getter bouts", () => {

        it("should return an array of bouts", () => {
            expect(event.bouts[0].firstBoxer.name).toBe("Paul Butler");
            expect(event.bouts[6].secondBoxer.name).toBe("Troy James");
        });

        describe("bouts values", () => {

            let bout: BoxrecPageEventBoutRow;

            beforeAll(() => {
                bout = event.bouts[3]; // Bellew Haye 2
            });

            describe("getter firstBoxerLast6", () => {

                it("should return last 6", () => {
                    expect(bout.firstBoxerLast6).toEqual(Array(6).fill(WinLossDraw.win));
                });

            });

            describe("getter links", () => {

                it("should return links in an object", () => {
                    expect(bout.links.bout).toBe(2209971);
                    expect(bout.links.bio_open).toBe(2209971);
                });

                it("should return unknown links in the other object", () => {
                    expect(bout.links.other).toEqual([]);
                });

            });

        });

    });

});
