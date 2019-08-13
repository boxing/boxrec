import {mockEventPageBellewHaye2, mockEventPageMayweatherMcGregor} from "boxrec-mocks";
import {WeightDivision} from "boxrec-requests/dist/boxrec-requests.constants";
import {WinLossDraw} from "../boxrec.constants";
import {BoxrecEventBoutRowOutput, BoxrecEventOutput, BoxrecPromoter} from "./boxrec.event.constants";
import {BoxrecPageEvent} from "./boxrec.page.event";

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

            it("should return the location object", () => {
                expect(eventBellewHaye2.location).toEqual({
                    location: {
                        country: {
                            id: "UK",
                            name: "United Kingdom"
                        },
                        region: {
                            id: "LON",
                            name: "London"
                        },
                        town: {
                            id: 15965,
                            name: "Greenwich"
                        }
                    },
                    venue: {
                        id: 258072,
                        name: "O2 Arena"
                    }
                });
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

            const expectPromoter: (p: BoxrecPromoter[], c: string, i: number, n: string) => void =
                (promoters: BoxrecPromoter[], companyExpect: string, idExpect: number, nameExpect: string): void => {
                    const prom: BoxrecPromoter = promoters.find(item => item.id === idExpect) as BoxrecPromoter;
                    expect(prom.company).toBe(companyExpect);
                    expect(prom.id).toBe(idExpect);
                    expect(prom.name).toBe(nameExpect);
                };

            it("should give the first promoter", () => {
                // todo these values flip flop back and forth, sort by id or name
                expectPromoter(eventBellewHaye2.promoters, "Matchroom Boxing", 596434, "Eddie Hearn");
            });

            it("should give the second promoter", () => {
                expectPromoter(eventBellewHaye2.promoters, "Hayemaker Promotions", 550318, "David Haye");
            });

        });

    });

    describe("getter doctor", () => {

        it("should return an array of doctors", () => {
            expect(eventMayweatherMcGregor.doctors[0].id).toBeGreaterThan(411360);
        });

    });

    describe("getter matchmakers", () => {

        it("should be an array as there can be multiple matchmakers", () => {
            // check for either value as the order can change
            expect([418276, 809320]).toContain(eventBellewHaye2.matchmakers[0].id);
            expect(["Neil Bowers", "Paul Ready"]).toContain(eventBellewHaye2.matchmakers[0].name);
        });

    });

    describe("getter television", () => {

        it("should return an array of broadcasters", () => {
            expect(eventBellewHaye2.television).toContain("United Kingdom SKY Box Office");
        });

    });

    describe("getter media", () => {

        it("should return the same as `television` as this field was renamed", () => {
            expect(eventBellewHaye2.media).toEqual(eventBellewHaye2.television);
        });

    });

    describe("getter bouts", () => {

        it("should return an array of bouts", () => {
            expect(eventBellewHaye2.bouts[bellewHayeIndex].firstBoxer.name).toBe("Tony Bellew");
            expect(eventBellewHaye2.bouts[bellewHayeIndex].secondBoxer.name).toBe("David Haye");
        });

        describe("bouts values", () => {

            let bout: BoxrecEventBoutRowOutput;

            beforeAll(() => {
                bout = eventBellewHaye2.bouts[bellewHayeIndex];
            });

            describe("getter sport", () => {

                it("should return what sport it was", () => {
                    // todo sports should all align
                    expect(bout.sport).toBe("pro boxing");
                });

            });

            describe("getter firstBoxerLast6", () => {

                it("should return last 6", () => {
                    expect(bout.firstBoxerLast6).toEqual(Array(6).fill(WinLossDraw.win));
                });

            });

            describe("getter secondBoxerLast6", () => {

                it("should return last 6", () => {
                    expect(bout.secondBoxerLast6.length).toBe(6);
                    expect(bout.secondBoxerLast6[5]).toBe(WinLossDraw.loss);
                });

            });

            describe("getter divisions", () => {

                it("should return the division", () => {
                    expect(bout.division).toBe(WeightDivision.heavyweight);
                });

            });

            describe("getter firstBoxerWeight", () => {

                it("should return the first fighter's weight", () => {
                    expect(bout.firstBoxerWeight).toBe(210.25);
                });

            });

            describe("getter firstBoxerLast6", () => {

                it("should return the first fighter's last 6", () => {
                    expect(bout.firstBoxerLast6).toEqual(Array.from(Array(6), () => WinLossDraw.win));
                });

            });

            describe("getter secondBoxerWeight", () => {

                it("should return the second fighter's weight", () => {
                    expect(bout.secondBoxerWeight).toBe(220);
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
