import {mockEventPageBellewHaye2, mockEventPageMayweatherMcGregor} from "boxrec-mocks";
import {WinLossDraw} from "../boxrec.constants";
import {BoxrecEventOutput, BoxrecPromoter} from "./boxrec.event.constants";
import {BoxrecPageEvent} from "./boxrec.page.event";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

describe("class BoxrecPageEvent", () => {

    let eventBellewHaye2: BoxrecEventOutput;
    let eventMayweatherMcGregor: BoxrecEventOutput;

    // the BoxRec events page keeps changing where it positions Haye/Bellew fight
    // get the index to prevent the tests from failing
    let bellewHayeIndex: number = 0;

    beforeAll(() => {
        eventBellewHaye2 = new BoxrecPageEvent(mockEventPageBellewHaye2).output;
        eventMayweatherMcGregor = new BoxrecPageEvent(mockEventPageMayweatherMcGregor).output;

        bellewHayeIndex = eventBellewHaye2.bouts.findIndex(item => item.firstBoxer.id === 425328);
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

        });

        describe("venue", () => {

            it("should return the venue id", () => {
                expect(eventBellewHaye2.location.venue.id).toBe(258072);
            });

            it("should return the venue name", () => {
                expect(eventBellewHaye2.location.venue.name).toBe("O2 Arena");
            });

        });

    });

    describe("getter commission", () => {

        it("should return the commission", () => {
            expect(eventBellewHaye2.commission).toBe("British Boxing Board of Control");
        });

    });

    describe("getter id", () => {

        it("should return the id", () => {
            expect(eventBellewHaye2.id).toBe(761332);
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
                expectPromoter(eventBellewHaye2.promoters[0], "Matchroom Boxing", 596434, "Eddie Hearn");
            });

            it("should give the second promoter", () => {
                expectPromoter(eventBellewHaye2.promoters[1], "Hayemaker Promotions", 550318, "David Haye");
            });

        });

    });

    describe("getter doctor", () => {

        it("should return an array of doctors", () => {
            expect(eventMayweatherMcGregor.doctors[0].id).toBe(412676);
        });

    });

    describe("getter matchmakers", () => {

        it("should be an array as there can be multiple matchmakers", () => {
            expect(eventBellewHaye2.matchmakers).toEqual([
                {
                    id: 418276,
                    name: "Neil Bowers",
                },
                {
                    id: 809320,
                    name: "Paul Ready"
                }
            ]);
        });

    });

    describe("getter television", () => {

        it("should return an array of broadcasters", () => {
            expect(eventBellewHaye2.television).toContain("United Kingdom SKY Box Office");
        });

    });

    describe("getter bouts", () => {

        it("should return an array of bouts", () => {
            expect(eventBellewHaye2.bouts[bellewHayeIndex].firstBoxer.name).toBe("Tony Bellew");
            expect(eventBellewHaye2.bouts[bellewHayeIndex].secondBoxer.name).toBe("David Haye");
        });

        describe("bouts values", () => {

            let bout: BoxrecPageEventBoutRow;

            beforeAll(() => {
                bout = eventBellewHaye2.bouts[bellewHayeIndex];
            });

            describe("getter firstBoxerLast6", () => {

                it("should return last 6", () => {
                    expect(bout.firstBoxerLast6).toEqual(Array(6).fill(WinLossDraw.win));
                });

            });

            describe("getter links", () => {

                it("should return links in an object", () => {
                    expect(bout.links.bout).toBe("761332/2209971");
                    expect(bout.links.bio).toBe(2209971);
                });

                it("should return unknown links in the other object", () => {
                    expect(bout.links.other).toEqual([]);
                });

            });

        });

    });

});
