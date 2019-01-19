import {mockMiddleweightWBCBelt} from "boxrec-mocks";
import {Location} from "../boxrec.constants";
import {BoxrecPageTitle} from "./boxrec.page.title";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";

describe("class BoxrecPageTitle", () => {

    let title: BoxrecPageTitle;

    beforeAll(() => {
        title = new BoxrecPageTitle(mockMiddleweightWBCBelt);
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

            describe("getter links", () => {

                it("should return an object", () => {
                    expect(mostRecentBout.links).toEqual({
                        bio: jasmine.any(Number),
                        bout: jasmine.any(String),
                        event: jasmine.any(Number),
                        other: []
                    });
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

                it("should be a location object", () => {
                    const location: Location = mostRecentBout.location;
                    expect(location.country).toBeDefined();
                    expect(location.id).toBeDefined();
                    expect(location.region).toBeDefined();
                    expect(location.town).toBeDefined();
                });

            });

        });

    });

});
