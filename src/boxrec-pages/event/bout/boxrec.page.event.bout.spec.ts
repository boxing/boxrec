import * as fs from "fs";
import {boxRecMocksModulePath, WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxingBoutOutcome} from "../boxrec.event.constants";
import {BoxrecPageEventBout} from "./boxrec.page.event.bout";

const mockBoutCaneloGGG1: string = fs.readFileSync(
    `${boxRecMocksModulePath}/events/bout/mockBoutCaneloGGG1.html`, "utf8");

describe("class BoxrecPageEventBout", () => {

    let caneloGGG1: BoxrecPageEventBout;

    beforeAll(() => {
        caneloGGG1 = new BoxrecPageEventBout(mockBoutCaneloGGG1);
    });

    describe("getter date", () => {

        it("should give the date", () => {
            expect(caneloGGG1.date).toBe("2017-09-16");
        });

    });

    describe("getter rating", () => {

        it("should return the rating of the bout", () => {
            expect(caneloGGG1.rating).toBe(100);
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
                    id: "75/Middleweight",
                    name: "International Boxing Federation World Middleweight Title",

                }, {
                    id: "189/Middleweight",
                    name: "International Boxing Organization World Middleweight Title",
                    supervisor: {
                        id: 403048,
                        name: "Ed Levine",
                    },
                }, {
                    id: "43/Middleweight",
                    name: "World Boxing Association Super World Middleweight Title",
                }, {
                    id: "6/Middleweight",
                    name: "World Boxing Council World Middleweight Title",
                }
            ]);
        });
    });

    describe("getter referee", () => {

        it("should return the id of the ref", () => {
            expect(caneloGGG1.referee.id).toBe(400853);
        });

        it("should return the name of the ref", () => {
            expect(caneloGGG1.referee.name).toBe("Kenny Bayless");
        });

    });

    describe("getter judges", () => {

        // because BoxRec is playing dangerously with `style` and no proper selectors, we'll test all judges

        it("should return the id, name and scorecard of judges", () => {
            expect(caneloGGG1.judges[0].id).toBe(401967);
            expect(caneloGGG1.judges[0].name).toBe("Adalaide Byrd");
            expect(caneloGGG1.judges[0].scorecard).toEqual([110, 118]);
        });

        it("should return the id, name and scorecard of judges", () => {
            expect(caneloGGG1.judges[1].id).toBe(401002);
            expect(caneloGGG1.judges[1].name).toBe("Dave Moretti");
            expect(caneloGGG1.judges[1].scorecard).toEqual([115, 113]);
        });

        it("should return the id, name and scorecard of judges", () => {
            expect(caneloGGG1.judges[2].id).toBe(402265);
            expect(caneloGGG1.judges[2].name).toBe("Don Trella");
            expect(caneloGGG1.judges[2].scorecard).toEqual([114, 114]);
        });

    });

    describe("getter firstBoxerRanking", () => {

        it("should be the first boxer's rating", () => {
            expect(caneloGGG1.firstBoxerRanking).toBe(2);
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

    describe("getter promoter", () => {

        it("should return the first promoter", () => {
            const {company, id, name} = caneloGGG1.promoters[0];
            expect(id).toBe(8253);
            expect(name).toBe("Oscar De La Hoya");
            expect(company).toBe("Golden Boy Promotions");
        });

        it("should return the second promoter if they exist", () => {
            const {company, id, name} = caneloGGG1.promoters[1];
            expect(id).toBe(495527);
            expect(name).toBe("Tom Loeffler");
            expect(company).toBe("360/GGG/K2 Promotions");
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

    describe("getter firstBoxerLast6", () => {

        describe("array of last 6 boxers", () => {

            it("should give the first boxer information", () => {
                const {date, id, name, outcome, outcomeByWayOf} = caneloGGG1.firstBoxerLast6[0];
                expect(name).toBe("Daniel Jacobs");
                expect(id).toBe(432984);
                expect(date).toBe("2017-03-18");
                expect(outcome).toBe(WinLossDraw.win);
                expect(outcomeByWayOf).toBe(BoxingBoutOutcome.UD);
            });

            it("should give the second boxer information", () => {
                const {date, id, name, outcome, outcomeByWayOf} = caneloGGG1.firstBoxerLast6[1];
                expect(name).toBe("Kell Brook");
                expect(id).toBe(272717);
                expect(date).toBe("2016-09-10");
                expect(outcome).toBe(WinLossDraw.win);
                expect(outcomeByWayOf).toBe(BoxingBoutOutcome.TKO);
            });

        });

    });

    describe("getter secondBoxerLast6", () => {

        describe("array of last 6 boxers", () => {

            it("should give the first boxer information", () => {
                const {date, id, name, outcome, outcomeByWayOf} = caneloGGG1.secondBoxerLast6[0];
                expect(name).toBe("Julio Cesar Chavez Jr");
                expect(id).toBe(214371);
                expect(date).toBe("2017-05-06");
                expect(outcome).toBe(WinLossDraw.win);
                expect(outcomeByWayOf).toBe(BoxingBoutOutcome.UD);
            });

            it("should give the second boxer information", () => {
                const {date, id, name, outcome, outcomeByWayOf} = caneloGGG1.secondBoxerLast6[1];
                expect(name).toBe("Liam Smith");
                expect(id).toBe(466535);
                expect(date).toBe("2016-09-17");
                expect(outcome).toBe(WinLossDraw.win);
                expect(outcomeByWayOf).toBe(BoxingBoutOutcome.KO);
            });

        });

    });

    describe("getter secondBoxerReach", () => {

        it("should return reach of the boxer", () => {
            expect(caneloGGG1.secondBoxerReach).toEqual([70.5, 179]);
        });

    });

    describe("getter firstBoxerPointsBefore", () => {

        it("should return the points before", () => {
            expect(caneloGGG1.firstBoxerPointsBefore).toBe(717);
        });

    });

    describe("getter secondBoxerPointsBefore", () => {

        it("should return the points before", () => {
            expect(caneloGGG1.secondBoxerPointsBefore).toBe(1105);
        });

    });

    describe("getter firstBoxerPointsAfter", () => {

        it("should return the points after", () => {
            expect(caneloGGG1.firstBoxerPointsAfter).toBe(847);
        });

    });

    describe("getter secondBoxerPointsAfter", () => {

        it("should return the points after", () => {
            expect(caneloGGG1.secondBoxerPointsAfter).toBe(976);
        });

    });

    describe("getter matchmakers", () => {

        it("should return an array of matchmakers", () => {
            expect(caneloGGG1.matchmakers[0].id).toBe(422440);
            expect(caneloGGG1.matchmakers[0].name).toBe("Alex Camponovo");
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
            expect(caneloGGG1.doctors[0].id).toBe(412676);
            expect(caneloGGG1.doctors[0].name).toBe("Anthony Ruggeroli");
        });

    });

});
