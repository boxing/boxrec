import {mockMiddleweightWBCBelt} from "boxrec-mocks";
import {WinLossDraw} from "../boxrec.constants";
import {BoxrecPageTitle} from "./boxrec.page.title";
import {BoxrecPageTitleRowOutput} from "./boxrec.page.title.constants";

describe("class BoxrecPageTitle", () => {

    let title: BoxrecPageTitle;

    beforeAll(() => {
        title = new BoxrecPageTitle(mockMiddleweightWBCBelt);
    });

    describe("getter output", () => {

        it("should give the name of the title", () => {
            expect(title.output.name).toBe("World Boxing Council World Middleweight Title");
        });

        it("should return the id and name of the current champion", () => {
            expect(title.output.champion).toEqual({
                id: jasmine.any(Number),
                name: jasmine.any(String),
            });
        });

        it("should return the total number of bouts that occurred for this title", () => {
            expect(title.output.numberOfBouts).toBeGreaterThanOrEqual(0);
        });

        describe("getter bouts", () => {

            it("should return an array of bouts that occurred for this title", () => {
                expect(title.output.bouts).toEqual(jasmine.any(Array));
            });

            describe("bout values", () => {

                let mostRecentBout: BoxrecPageTitleRowOutput;

                beforeAll(() => {
                    mostRecentBout = title.output.bouts[0];
                });

                describe("getter date", () => {

                    it("should include the date", () => {
                        expect(mostRecentBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
                    });

                });

                describe("getter outcome", () => {

                    it("should have the outcome", () => {
                        expect(Object.values(WinLossDraw)).toContain(mostRecentBout.outcome);
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

                    it("`bout` should match string separated by forward slash", () => {
                        expect(mostRecentBout.links.bout).toMatch(/\d+\/\d+/);
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

                describe("getter firstBoxerWeight", () => {

                    it("should be numeric", () => {
                        // this is testing middleweight title bouts, we expect it should be at 155
                        expect(mostRecentBout.firstBoxerWeight).toBeGreaterThan(155);
                        expect(mostRecentBout.firstBoxerWeight).toBeLessThan(165);
                    });

                });

                describe("getter secondBoxerWeight", () => {

                    it("should be numeric", () => {
                        // this is testing middleweight title bouts, we expect it should be at 155
                        expect(mostRecentBout.secondBoxerWeight).toBeGreaterThan(155);
                        expect(mostRecentBout.secondBoxerWeight).toBeLessThan(165);
                    });

                });

                describe("getter numberOfRounds", () => {

                    it("should include the number of rounds", () => {
                        expect(mostRecentBout.numberOfRounds[0]).toBeGreaterThan(0);
                        expect(mostRecentBout.numberOfRounds[1]).toBeGreaterThan(0);
                    });
                });
            });
        });
    });
});
