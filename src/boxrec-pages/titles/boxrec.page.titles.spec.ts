import {
    mockTitlesAllTitleAllScheduled,
    mockTitlesTitleSelectedAllScheduled,
    mockTitlesTitleSelectedSuperMiddleweight
} from "boxrec-mocks";
import {BoxrecPageTitles} from "./boxrec.page.titles";
import {BoxrecPageTitlesRow} from "./boxrec.page.titles.row";

describe("class BoxrecPageTitles", () => {

    let superMiddleweightTitle: BoxrecPageTitles;
    let scheduledTitle: BoxrecPageTitles;
    let allTitleAllSchedule: BoxrecPageTitles;

    beforeAll(() => {
        superMiddleweightTitle = new BoxrecPageTitles(mockTitlesTitleSelectedSuperMiddleweight);
        scheduledTitle = new BoxrecPageTitles(mockTitlesTitleSelectedAllScheduled);
        allTitleAllSchedule = new BoxrecPageTitles(mockTitlesAllTitleAllScheduled);
    });

    const locationObj: any = {
        country: jasmine.any(String),
        id: jasmine.any(Number),
        region: jasmine.anything(),
        town: jasmine.any(String),
    };

    // tests for bio_closed links
    const bioClosedTestObject: (firstBout: BoxrecPageTitlesRow) => void = (firstBout: BoxrecPageTitlesRow) => {
        expect(firstBout.links).toEqual({
            bio: jasmine.any(Number),
            bout: jasmine.any(String),
            event: jasmine.any(Number),
            other: [],
        });
    };

    describe("getter numberOfPages", () => {

        it("should return number of pages", () => {
            expect(scheduledTitle.numberOfPages).toBeGreaterThanOrEqual(0);
        });

    });

    describe("is division page", () => {

        describe("getter bouts", () => {

            let firstBout: BoxrecPageTitlesRow;

            beforeAll(() => {
                firstBout = superMiddleweightTitle.bouts[0];
            });

            it("should have the date", () => {
                expect(firstBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
            });

            it("should have the location", () => {
                expect(firstBout.location).toEqual(locationObj);
            });

            it("should have the rating", () => {
                expect(firstBout.rating).toEqual(jasmine.any(Number));
            });

            it("should include the number of rounds", () => {
                expect(firstBout.numberOfRounds).toEqual([
                    jasmine.any(Number),
                    jasmine.any(Number),
                ]);
            });

            it("should include an object of links", () => {
                bioClosedTestObject(firstBout);
            });

        });

    });

    describe("is scheduled titles page", () => {

        describe("is selected title", () => {

            describe("getter bouts", () => {

                let firstBout: BoxrecPageTitlesRow;

                beforeAll(() => {
                    firstBout = scheduledTitle.bouts[0];
                });

                it("should have the date", () => {
                    expect(firstBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
                });

                it("should have the location", () => {
                    expect(firstBout.location).toEqual(locationObj);
                });

                it("should have the rating", () => {
                    expect(firstBout.rating).toEqual(jasmine.any(Number));
                });

                it("should include the number of rounds", () => {
                    expect(firstBout.numberOfRounds).toEqual([
                        jasmine.any(Number),
                        jasmine.any(Number),
                    ]);
                });

                it("should include an object of links", () => {
                    expect(firstBout.links).toEqual({
                        bio: jasmine.any(Number),
                        bout: jasmine.any(String),
                        event: jasmine.any(Number),
                        other: [],
                    });
                });

            });

        });

        describe("all titles", () => {

            describe("getter bouts", () => {

                let firstBout: BoxrecPageTitlesRow;

                beforeAll(() => {
                    firstBout = allTitleAllSchedule.bouts[0];
                });

                it("should have the date", () => {
                    expect(firstBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
                });

                it("should have the location", () => {
                    expect(firstBout.location).toBeDefined();
                });

                it("should have the rating", () => {
                    expect(firstBout.rating).toEqual(jasmine.any(Number));
                });

                it("should include the number of rounds", () => {
                    expect(firstBout.numberOfRounds).toEqual([
                        jasmine.any(Number),
                        jasmine.any(Number),
                    ]);
                });

                it("should include an object of links", () => {
                    expect(firstBout.links).toEqual({
                        bio: jasmine.any(Number),
                        bout: jasmine.any(String),
                        event: jasmine.any(Number),
                        other: [],
                    });
                });

            });

        });

    });

});
