import * as fs from "fs";
import {boxRecMocksModulePath} from "../boxrec.constants";
import {BoxrecPageTitle} from "./boxrec.page.title";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";

const mockTitleInformation: string = fs.readFileSync(`${boxRecMocksModulePath}/title/mockMiddleweightWBCbelt.html`, "utf8");

describe("class BoxrecPageSearch", () => {

    let title: BoxrecPageTitle;

    beforeAll(() => {
        title = new BoxrecPageTitle(mockTitleInformation);
    });

    describe("getter name", () => {

        it("should give the name of the title", () => {
            expect(title.name).toBe("World Boxing Council World Middleweight Title");
        });

    });

    describe("getter champion", () => {

        it("should return the id and name of the current champion", () => {
            expect(title.champion).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

    });

    describe("getter numberOfBouts", () => {

        it("should return the total number of bouts that occurred for this title", () => {
            expect(title.numberOfBouts).toBeGreaterThanOrEqual(0);
        });

    });

    describe("getter bouts", () => {

        it("should return an array of bouts that occurred for this title", () => {
            expect(title.bouts).toEqual(jasmine.any(Array));
        });

        describe("bout values", () => {

            let mostRecentBout: BoxrecPageTitleRow;

            beforeAll(() => {
                mostRecentBout = title.bouts[0];
            });

            describe("getter date", () => {

                it("should include the date", () => {
                    expect(mostRecentBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
                });

            });

            describe("getter firstBoxer", () => {

                it("should include the name and id of the first boxer", () => {
                    expect(mostRecentBout.firstBoxer.id).not.toBeNull();
                    expect(mostRecentBout.firstBoxer.name).not.toBeNull();
                });

            });

            describe("getter secondBoxer", () => {

                it("should include the name and id of the second boxer", () => {
                    expect(mostRecentBout.secondBoxer.id).not.toBeNull();
                    expect(mostRecentBout.secondBoxer.name).not.toBeNull();
                });

            });

            describe("getter numberOfRounds", () => {

                it("should include the number of rounds", () => {
                    expect(mostRecentBout.numberOfRounds[0]).toBeGreaterThan(0);
                    expect(mostRecentBout.numberOfRounds[1]).toBeGreaterThan(0);
                });

            });

            describe("getter location", () => {

                it("should include the town", () => {
                    expect(mostRecentBout.location.town).not.toBeNull();
                });

                it("should include the region", () => {
                    expect(mostRecentBout.location.region).not.toBeNull();
                });

                it("should include the country", () => {
                    expect(mostRecentBout.location.country).not.toBeNull();
                });

                it("should include the id", () => {
                    expect(mostRecentBout.location.id).not.toBeNull();
                });

            });

        });

    });

});
