import {BoxingBoutOutcome, boxRecMocksModulePath, WeightClass, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";
import {trimRemoveLineBreaks} from "../../helpers";

const fs = require("fs");

// mock for a bout that has finished on an events page
const mockBoutFinishedBout = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockBoutFinishedBout.html`, "utf8");
const mockBoutFinishedBoutAdditionalData = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockBoutFinishedBoutAdditionalData.html`, "utf8");

// mock for a bout that has not finished on an events page
const mockFutureBout = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockFutureBout.html`, "utf8");

// mock for a bout where an opponent has not been announced
const mockFutureBoutTBA = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockFutureBoutTBA.html`, "utf8");

// mock where a boxer had his debut fight
const mockBoutDebut = fs.readFileSync(`${boxRecMocksModulePath}/events/bout/mockBoutDebut.html`, "utf8");

describe("class BoxrecPageEventBoutRow", () => {

    let bout: BoxrecPageEventBoutRow;
    let futureBout: BoxrecPageEventBoutRow;

    beforeAll(() => {
        bout = new BoxrecPageEventBoutRow(mockBoutFinishedBout, mockBoutFinishedBoutAdditionalData);
        futureBout = new BoxrecPageEventBoutRow(mockFutureBout);
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

        it("should return null if the boxer has not been weighed", () => {
            expect(futureBout.firstBoxerWeight).toBe(null);
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

        it("should return unknown if the bout has not occurred", () => {
            expect(futureBout.outcome).toBe(WinLossDraw.unknown);
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

        it("should return null for all 3 values if the bout has not occurred", () => {
            expect(futureBout.result[0]).toBe(WinLossDraw.unknown);
            expect(futureBout.result[1]).toBeNull();
            expect(futureBout.result[2]).toBeNull();
        });

    });

    describe("getter numberOfRounds", () => {

        it("should be an array of numbers", () => {
            expect(bout.numberOfRounds[0]).toBe(5);
            expect(bout.numberOfRounds[1]).toBe(12);
        });

        it("should return null for both values if the number of rounds is unknown", () => {
            const noRounds = new BoxrecPageEventBoutRow(mockFutureBoutTBA.replace(/10<\/td>/, ""));
            expect(noRounds.numberOfRounds[0]).toBeNull();
            expect(noRounds.numberOfRounds[1]).toBeNull();
        });

    });

    describe("getter opponent", () => {

        it("should return the boxer id", () => {
            expect(bout.secondBoxer.id).toBe(155774);
        });

        it("should return the boxer name", () => {
            expect(bout.secondBoxer.name).toBe("David Haye");
        });

        it("should return null if the second boxer hasn't been picked", () => {
            const noBoxerBout = new BoxrecPageEventBoutRow(mockFutureBoutTBA);
            expect(noBoxerBout.secondBoxer.id).toBeNull();
            expect(noBoxerBout.secondBoxer.name).toBeNull();
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

        it("should include null for win/loss/draw if the second boxer hasn't been picked", () => {
            const noBoxerBout: BoxrecPageEventBoutRow = new BoxrecPageEventBoutRow(mockFutureBoutTBA);
            expect(noBoxerBout.secondBoxerRecord.win).toBeNull();
            expect(noBoxerBout.secondBoxerRecord.draw).toBeNull();
            expect(noBoxerBout.secondBoxerRecord.loss).toBeNull();
        });

        describe("if it is the boxer's debut", () => {

            let debutBout: BoxrecPageEventBoutRow;

            beforeAll(() => {
                debutBout = new BoxrecPageEventBoutRow(mockBoutDebut);
            });

            it("should give 0 wins if it is the boxer's debut", () => {
                expect(debutBout.secondBoxerRecord.win).toBe(0);
            });

            it("should give 0 losses if it is the boxer's debut", () => {
                expect(debutBout.secondBoxerRecord.loss).toBe(0);
            });

            it("should give 0 draws if it is the boxer's debut", () => {
                expect(debutBout.secondBoxerRecord.draw).toBe(0);
            });

        });

    });

    describe("getter secondBoxerLast6", () => {

        it("should include the stats for the other boxer's last 6 bouts", () => {
            expect(bout.secondBoxerLast6[5]).toEqual(WinLossDraw.loss);
            expect(bout.secondBoxerLast6[4]).toEqual(WinLossDraw.win);
        });

        it("should return a loss if the boxer has had one", () => {
            const tmpBout = new BoxrecPageEventBoutRow(mockBoutFinishedBout, "L");
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
