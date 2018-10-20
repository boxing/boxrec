import * as fs from "fs";
import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import {BoxrecPromoter} from "./boxrec.event.constants";
import {BoxrecPageEvent} from "./boxrec.page.event";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

const mockEventBellewHaye2: string = fs.readFileSync(
    `${boxRecMocksModulePath}/events/mockEventPageBellewHaye2.html`, "utf8");
const mockEventMayweatherMcGregor: string = fs.readFileSync(
    `${boxRecMocksModulePath}/events/mockEventPageMayweatherMcGregor.html`, "utf8");
const mockEventPageNoVenueNoRegionTown: string = fs.readFileSync(
    `${boxRecMocksModulePath}/events/mockEventPageNoVenueNoRegionTown.html`, "utf8");

describe("class BoxrecPageEvent", () => {

    let eventBellewHaye2: BoxrecPageEvent;
    let eventMayweatherMcGregor: BoxrecPageEvent;
    let eventNoVenueNoRegionTown: BoxrecPageEvent;

    beforeAll(() => {
        eventBellewHaye2 = new BoxrecPageEvent(mockEventBellewHaye2);
        eventMayweatherMcGregor = new BoxrecPageEvent(mockEventMayweatherMcGregor);
        eventNoVenueNoRegionTown = new BoxrecPageEvent(mockEventPageNoVenueNoRegionTown);
    });

    describe("getter date", () => {

        it("should return the date of the event", () => {
            expect(eventBellewHaye2.date).toBe("2018-05-05");
        });

    });

    describe("getter location", () => {

        describe("location", () => {

            it("should return the town", () => {
                expect(eventBellewHaye2.location.location.town).toBe("Greenwich");
            });

            it("should return the region", () => {
                expect(eventBellewHaye2.location.location.region).toBe("London");
            });

            it("should return the country", () => {
                expect(eventBellewHaye2.location.location.country).toBe("United Kingdom");
            });

            it("should return the id", () => {
                expect(eventBellewHaye2.location.location.id).toBe(15965);
            });

            describe("when region/town are missing", () => {
                // todo
                it("should return null values for region/town", () => {
                    expect(eventNoVenueNoRegionTown.location.location.region).toBeNull();
                    expect(eventNoVenueNoRegionTown.location.location.town).toBeNull();
                });

                it("should return the country name", () => {
                    expect(eventNoVenueNoRegionTown.location.location.country).toBe("Austria");
                });

            });

        });

        describe("venue", () => {

            it("should return the venue id", () => {
                expect(eventBellewHaye2.location.venue.id).toBe(28476);
            });

            it("should return the venue name", () => {
                expect(eventBellewHaye2.location.venue.name).toBe("O2 Arena (Millenium Dome)");
            });

            describe("when venue is missing", () => {

                it("should return null values", () => {
                    expect(eventNoVenueNoRegionTown.location.venue.name).toBeNull();
                    expect(eventNoVenueNoRegionTown.location.venue.id).toBeNull();
                });

            });

        });

    });

    describe("getter commission", () => {

        it("should return the commission", () => {
            expect(eventBellewHaye2.commission).toBe("British Boxing Board of Control");
        });

    });

    describe("getter promoter", () => {

        describe("listing the promoter(s)", () => {

            const expectPromoter: (p: BoxrecPromoter, c: string, i: number, n: string) => void =
                (promoter: BoxrecPromoter, companyExpect: string, idExpect: number, nameExpect: string): void => {
                    expect(promoter.company).toBe(companyExpect);
                    expect(promoter.id).toBe(idExpect);
                    expect(promoter.name).toBe(nameExpect);
                };

            it("should give the first promoter", () => {
                expectPromoter(eventBellewHaye2.promoters[0], "Hayemaker Promotions", 550318, "David Haye");
            });

            it("should give the second promoter", () => {
                expectPromoter(eventBellewHaye2.promoters[1], "Matchroom Boxing", 596434, "Eddie Hearn");
            });

        });

    });

    describe("getter doctor", () => {

        it("should return an array of doctors", () => {
            expect(eventMayweatherMcGregor.doctors[0].id).toBe(412676);
        });

    });

    describe("getter matchmakers", () => {

        it("should return the matchmaker", () => {
            expect(eventBellewHaye2.matchmakers[0].id).toBe(809320);
            expect(eventBellewHaye2.matchmakers[0].name).toBe("Paul Ready");
        });

    });

    describe("getter television", () => {

        it("should return an array of broadcasters", () => {
            expect(eventBellewHaye2.television).toContain("United Kingdom SKY Box Office");
        });

    });

    describe("getter bouts", () => {

        it("should return an array of bouts", () => {
            expect(eventBellewHaye2.bouts[0].firstBoxer.name).toBe("Paul Butler");
            expect(eventBellewHaye2.bouts[6].secondBoxer.name).toBe("Troy James");
        });

        describe("bouts values", () => {

            let bout: BoxrecPageEventBoutRow;

            beforeAll(() => {
                bout = eventBellewHaye2.bouts[3]; // Bellew Haye 2
            });

            describe("getter firstBoxerLast6", () => {

                it("should return last 6", () => {
                    expect(bout.firstBoxerLast6).toEqual(Array(6).fill(WinLossDraw.win));
                });

            });

            describe("getter links", () => {

                it("should return links in an object", () => {
                    expect(bout.links.bout).toBe("761332/2209971");
                    expect(bout.links.bio_open).toBe(2209971);
                });

                it("should return unknown links in the other object", () => {
                    expect(bout.links.other).toEqual([]);
                });

            });

        });

    });

});
