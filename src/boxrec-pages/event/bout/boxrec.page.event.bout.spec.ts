import {mockBoutCaneloGGG1} from "boxrec-mocks";
import {BoxrecBasic, WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxingBoutOutcome} from "../boxrec.event.constants";
import {BoutPageLast6, BoxrecEventBoutOutput} from "./boxrec.event.bout.constants";
import {BoxrecPageEventBout} from "./boxrec.page.event.bout";

const testLast6: (last6Obj: BoutPageLast6, expectations: BoutPageLast6) => void =
    (last6Obj: BoutPageLast6, expectations: BoutPageLast6): void => {
        const {date, id, name, outcome, outcomeByWayOf} = last6Obj;
        expect(name).toBe(expectations.name);
        expect(id).toBe(expectations.id);
        expect(date).toBe(expectations.date);
        expect(outcome).toBe(expectations.outcome);
        expect(outcomeByWayOf).toBe(expectations.outcomeByWayOf);
    };

describe("class BoxrecPageEventBout", () => {

    let caneloGGG1: BoxrecEventBoutOutput;
    let caneloGGG1Fake: BoxrecPageEventBout;

    beforeAll(() => {
        caneloGGG1 = new BoxrecPageEventBout(mockBoutCaneloGGG1).output;

        // create additional HTML mock so we can modify it for testing
        let modifiedCaneloGGG1: string = mockBoutCaneloGGG1;

        // change the ranking for the first boxer to be empty
        modifiedCaneloGGG1 = modifiedCaneloGGG1.replace(/\>\d\</, "><");
        caneloGGG1Fake = new BoxrecPageEventBout(modifiedCaneloGGG1);
    });

    describe("getter date", () => {

        it("should give the date", () => {
            expect(caneloGGG1.date).toBe("2017-09-16");
        });

    });

    describe("getter location", () => {

        it("should return the venue", () => {
            expect(caneloGGG1.location.venue).toEqual({id: 246559, name: "T-Mobile Arena"});
        });

    });

    describe("getter division", () => {

        it("should return the division of this bout", () => {
            expect(caneloGGG1.division).toEqual(WeightDivision.middleweight);
        });

    });

    describe("getter numberOfRounds", () => {

        it("should return the total number of rounds", () => {
            expect(caneloGGG1.numberOfRounds).toBe(12);
        });

    });

    describe("getter titles", () => {

        it("should give an array of titles on the line for this fight", () => {
            expect(caneloGGG1.titles).toEqual([
                {
                    id: "6/Middleweight",
                    name: "World Boxing Council World Middleweight Title",
                },
                {
                    id: "43/Middleweight",
                    name: "World Boxing Association Super World Middleweight Title",
                },
                {
                    id: "75/Middleweight",
                    name: "International Boxing Federation World Middleweight Title",

                },
                {
                    id: "189/Middleweight",
                    name: "International Boxing Organization World Middleweight Title",
                    supervisor: {
                        id: 403048,
                        name: "Ed Levine",
                    },
                },
            ]);
        });
    });

    describe("getter referee", () => {

        // bug on BoxRec - https://github.com/boxing/boxrec/issues/171
        xit("should return the id of the ref", () => {
            expect(caneloGGG1.referee.id).toBe(400853);
        });

        it("should return the name of the ref", () => {
            expect(caneloGGG1.referee.name).toBe("Kenny Bayless");
        });

    });

    describe("getter judges", () => {

        // because BoxRec is playing dangerously with `style` and no proper selectors, we'll test all judges

        describe("first judge", () => {

            // breaking down this because of this BoxRec bug - https://github.com/boxing/boxrec/issues/170
            xit("should return the id", () => {
                expect(caneloGGG1.judges[0].id).toBe(401967);
            });

            xit("should return the name", () => {
                expect(caneloGGG1.judges[0].name).toBe("Adalaide Byrd");
            });

            xit("should return the scorecard", () => {
                expect(caneloGGG1.judges[0].scorecard).toEqual([110, 118]);
            });

        });

        // re-enable tests once resolved - https://github.com/boxing/boxrec/issues/170
        xit("should return the id, name and scorecard of judges", () => {
            expect(caneloGGG1.judges[1].id).toBe(401002);
            expect(caneloGGG1.judges[1].name).toBe("Dave Moretti");
            expect(caneloGGG1.judges[1].scorecard).toEqual([115, 113]);
        });

        // re-enable tests once resolved - https://github.com/boxing/boxrec/issues/170
        xit("should return the id, name and scorecard of judges", () => {
            expect(caneloGGG1.judges[2].id).toBe(402265);
            expect(caneloGGG1.judges[2].name).toBe("Don Trella");
            expect(caneloGGG1.judges[2].scorecard).toEqual([114, 114]);
        });

    });

    describe("getter firstBoxerRanking", () => {

        it("should be the first boxer's rating", () => {
            expect(caneloGGG1.firstBoxerRanking).toBe(2);
        });

        it("should return null if cannot find the boxer's ranking", () => {

            expect(caneloGGG1Fake.firstBoxerRanking).toBe(null);
        });

    });

    describe("getter secondBoxerRanking", () => {

        it("should be the second boxer's rating", () => {
            expect(caneloGGG1.secondBoxerRanking).toBe(1);
        });

    });

    describe("getter firstBoxerAge", () => {

        it("should be the first boxer's age", () => {
            expect(caneloGGG1.firstBoxerAge).toBe(35);
        });

    });

    describe("getter secondBoxerAge", () => {

        it("should be the second boxer's age", () => {
            expect(caneloGGG1.secondBoxerAge).toBe(27);
        });

    });

    describe("getter firstBoxerStance", () => {

        it("should return the stance", () => {
            expect(caneloGGG1.firstBoxerStance).toBe("orthodox");
        });

    });

    describe("getter secondBoxerStance", () => {

        it("should return the stance", () => {
            expect(caneloGGG1.secondBoxerStance).toBe("orthodox");
        });

    });

    describe("getter firstBoxerHeight", () => {

        it("should return the height of the boxer", () => {
            expect(caneloGGG1.firstBoxerHeight).toEqual([5, 10.5, 179]);
        });

    });

    describe("getter secondBoxerHeight", () => {

        it("should return height of the boxer", () => {
            expect(caneloGGG1.secondBoxerHeight).toEqual([5, 8, 173]);
        });

    });

    describe("getter firstBoxerReach", () => {

        it("should return reach of the boxer", () => {
            expect(caneloGGG1.firstBoxerReach).toEqual([70, 178]);
        });

    });

    describe("getter firstBoxerRecord", () => {

        it("should return the win/loss/draw record of the first boxer at this time", () => {
            const {win, loss, draw} = caneloGGG1.firstBoxerRecord;
            expect(win).toBe(37);
            expect(loss).toBe(0);
            expect(draw).toBe(0);
        });

    });

    describe("getter secondBoxerRecord", () => {

        it("should return the win/loss/draw record of the second boxer at this time", () => {
            const {win, loss, draw} = caneloGGG1.secondBoxerRecord;
            expect(win).toBe(49);
            expect(loss).toBe(1);
            expect(draw).toBe(1);
        });

    });

    describe("getter firstBoxerKOs", () => {

        it("should return the number of KOs for this boxer at the time", () => {
            expect(caneloGGG1.firstBoxerKOs).toBe(33);
        });

    });

    describe("getter secondBoxerKOs", () => {

        it("should return the number of KOs for this boxer at the time", () => {
            expect(caneloGGG1.secondBoxerKOs).toBe(34);
        });

    });

    describe("getter location", () => {

        describe("location", () => {

            it("should return the country", () => {
                expect(caneloGGG1.location.location.country).toEqual({
                    id: "US",
                    name: "USA",
                });
            });

            it("should return the region", () => {
                expect(caneloGGG1.location.location.region).toEqual({
                    id: "NV",
                    name: "Nevada",
                });
            });

            it("should return the town", () => {
                expect(caneloGGG1.location.location.town).toEqual({
                    id: 20388,
                    name: "Las Vegas",
                });
            });

        });

        it("should return the venue", () => {
            expect(caneloGGG1.location.venue).toEqual({
                id: 246559,
                name: "T-Mobile Arena",
            });
        });

    });

    describe("getter firstBoxerLast6", () => {

        describe("array of last 6 boxers", () => {

            it("should give the first boxer information", () => {

                testLast6(caneloGGG1.firstBoxerLast6[0], {
                    date: "2017-03-18",
                    id: 432984,
                    name: "Daniel Jacobs",
                    outcome: WinLossDraw.win,
                    outcomeByWayOf: BoxingBoutOutcome.UD,
                });

            });

            it("should give the second boxer information", () => {
                testLast6(caneloGGG1.firstBoxerLast6[1], {
                    date: "2016-09-10",
                    id: 272717,
                    name: "Kell Brook",
                    outcome: WinLossDraw.win,
                    outcomeByWayOf: BoxingBoutOutcome.TKO,
                });

            });

        });

    });

    describe("getter secondBoxerLast6", () => {

        describe("array of last 6 boxers", () => {

            it("should give the first boxer information", () => {
                testLast6(caneloGGG1.secondBoxerLast6[0], {
                    date: "2017-05-06",
                    id: 214371,
                    name: "Julio Cesar Chavez Jr",
                    outcome: WinLossDraw.win,
                    outcomeByWayOf: BoxingBoutOutcome.UD,
                });
            });

            it("should give the second boxer information", () => {
                testLast6(caneloGGG1.secondBoxerLast6[1], {
                    date: "2016-09-17",
                    id: 466535,
                    name: "Liam Smith",
                    outcome: WinLossDraw.win,
                    outcomeByWayOf: BoxingBoutOutcome.KO,
                });
            });

        });

    });

    describe("getter secondBoxerReach", () => {

        it("should return reach of the boxer", () => {
            expect(caneloGGG1.secondBoxerReach).toEqual([70.5, 179]);
        });

    });

    describe("getter firstBoxerPointsAfter", () => {

        it("should return the points after", () => {
            expect(caneloGGG1.firstBoxerPointsAfter).toEqual(jasmine.any(Number));
        });

    });

    describe("getter secondBoxerPointsAfter", () => {

        it("should return the points after", () => {
            expect(caneloGGG1.secondBoxerPointsAfter).toEqual(jasmine.any(Number));
        });

    });

    describe("getter matchmakers", () => {

        it("should return an array of matchmakers", () => {
            expect(caneloGGG1.matchmakers[0].id).toBeGreaterThan(400000);
            expect(caneloGGG1.matchmakers[0].name).not.toBeNull();
        });

    });

    describe("getter firstBoxer", () => {

        it("should return the name and id of the boxer", () => {
            expect(caneloGGG1.firstBoxer.id).toBe(356831);
            expect(caneloGGG1.firstBoxer.name).toBe("Gennady Golovkin");
        });

    });

    describe("getter secondBoxer", () => {

        it("should return the name and id of the boxer", () => {
            expect(caneloGGG1.secondBoxer.id).toBe(348759);
            expect(caneloGGG1.secondBoxer.name).toBe("Saul Alvarez");
        });

    });

    describe("getter outcome", () => {

        describe("when a bout is a draw", () => {

            it("should return the outcome of the bout", () => {
                expect(caneloGGG1.outcome.outcome).toBe(WinLossDraw.draw);
            });

            it("should have `boxer` values as `null`", () => {
                expect(caneloGGG1.outcome.boxer.id).toBeNull();
                expect(caneloGGG1.outcome.boxer.name).toBeNull();
            });

            it("should return `null` for `outcomeByWayOf`", () => {
                expect(caneloGGG1.outcome.outcomeByWayOf).toBe(BoxingBoutOutcome.SD);
            });

        });

    });

    describe("getter doctors", () => {

        it("should return an array of doctors", () => {
            expect(caneloGGG1.doctors[0].id).toBeGreaterThan(41130);
            expect(caneloGGG1.doctors[0].name).not.toBeNull();
        });

    });

});
