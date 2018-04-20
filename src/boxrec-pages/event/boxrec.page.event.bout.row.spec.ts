import {BoxingBoutOutcome, boxRecMocksModulePath, WeightClass, WinLossDraw} from "../boxrec.constants";
const fs = require("fs");
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

const mockBoutBellewHaye = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockBoutBellewHaye.html`, "utf8");
const mockBoutBellewHayeAdditionalData = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockBoutBellewHayeAdditionalData.html`, "utf8");

describe("class BoxrecPageEventBoutRow", () => {

    let bout: BoxrecPageEventBoutRow;

    beforeAll(() => {
        bout = new BoxrecPageEventBoutRow(mockBoutBellewHaye, mockBoutBellewHayeAdditionalData);
    });

    describe("getter division", () => {

        it("should return the division the bout will be at", () => {
            expect(bout.division).toBe(WeightClass.heavyweight);
        });

    });

    describe("getter firstBoxer", () => {

        it("should return the boxer id", () => {
            expect(bout.firstBoxer.id).toBe(425328);
        });

        it("should return the boxer name", () => {
            expect(bout.firstBoxer.name).toBe("Tony Bellew");
        });

    });

    describe("getter firstBoxerWeight", () => {

        it("should return the weight", () => {
            expect(bout.firstBoxerWeight).toBe(210.25);
        });

    });

    describe("getter firstBoxerRecord", () => {

        it("should include the wins of the other boxer", () => {
            expect(bout.firstBoxerRecord.win).toBe(29);
        });

        it("should include the losses of the other boxer", () => {
            expect(bout.firstBoxerRecord.loss).toBe(2);
        });

        it("should include the draws of the other boxer", () => {
            expect(bout.firstBoxerRecord.draw).toBe(1);
        });

    });

    describe("getter firstBoxerLast6", () => {

        it("should return last 6", () => {
            expect(bout.firstBoxerLast6).toEqual(Array(6).fill(WinLossDraw.win));
        });

    });

    describe("getter outcome", () => {

        it("should give the outcome of the bout", () => {
            expect(bout.outcome).toBe(WinLossDraw.win);
        });

    });

    describe("getter result", () => {

        it("should include the outcome of the bout", () => {
            expect(bout.result[0]).toBe(WinLossDraw.win);
        });

        it("should include how the bout ended", () => {
            expect(bout.result[1]).toBe("TKO");
        });

        it("should include how the bout ended - full text", () => {
            expect(bout.result[2]).toBe(BoxingBoutOutcome.TKO);
        });

    });

    describe("getter numberOfRounds", () => {

        it("should be an array of numbers", () => {
            expect(bout.numberOfRounds[0]).toBe(5);
            expect(bout.numberOfRounds[1]).toBe(12);
        });

    });

    describe("getter opponent", () => {

        it("should return the boxer id", () => {
            expect(bout.secondBoxer.id).toBe(155774);
        });

        it("should return the boxer name", () => {
            expect(bout.secondBoxer.name).toBe("David Haye");
        });

    });

    describe("getter secondBoxerWeight", () => {

        it("should return the opponent's weight", () => {
            expect(bout.secondBoxerWeight).toBe(220.25);
        });

    });

    describe("getter secondBoxerRecord", () => {

        it("should include the wins of the other boxer", () => {
            expect(bout.secondBoxerRecord.win).toBe(28);
        });

        it("should include the losses of the other boxer", () => {
            expect(bout.secondBoxerRecord.loss).toBe(3);
        });

        it("should include the draws of the other boxer", () => {
            expect(bout.secondBoxerRecord.draw).toBe(0);
        });

    });

    describe("getter secondBoxerLast6", () => {

        it("should include the stats for the other boxer's last 6 bouts", () => {
            expect(bout.secondBoxerLast6[5]).toEqual(WinLossDraw.loss);
            expect(bout.secondBoxerLast6[4]).toEqual(WinLossDraw.win);
        });

        it("should return a loss if the boxer has had one", () => {
            const tmpBout = new BoxrecPageEventBoutRow(mockBoutBellewHaye, "L");
            expect(tmpBout.secondBoxerLast6).toContain(WinLossDraw.loss);
        });

    });

    describe("getter rating", () => {

        it("should return the rating of the bout", () => {
            expect(bout.rating).toBe(60);
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

    describe("getter referee", () => {

        it("should return the referee name", () => {
            expect(bout.referee.name).toBe("Howard John Foster");
        });

        it("should return the referee id", () => {
            expect(bout.referee.id).toBe(401254);
        });

    });

    describe("getter judges", () => {

        describe("where 3 judges given", () => {

            it("should include an array", () => {
                expect(bout.judges.length).toBe(3);
            });

            it("should include the id of the judges", () => {
                expect(bout.judges[0].id).toBe(76854);
            });

            it("should include the name of the judges", () => {
                expect(bout.judges[0].name).toBe("Ian John Lewis");
            });

        });

        it("if no scorecards are given, an empty array should be given for the scorecard value", () => {
            expect(bout.judges[0].scorecard).toEqual([]);
        });

    });

});
