import {
    mockTitlesAllTitleAllScheduled,
    mockTitlesTitleSelectedAllScheduled,
    mockTitlesTitleSelectedSuperMiddleweight
} from "boxrec-mocks";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxrecPageTitlesRowOutput} from "./boxrec.page.title.constants";
import {BoxrecPageTitles} from "./boxrec.page.titles";

// tests for links
const linksTestObject: (links: BoxrecGeneralLinks) => void = (links: BoxrecGeneralLinks) => {
    expect(links).toEqual({
        bio: jasmine.any(Number),
        bout: jasmine.any(String),
        event: jasmine.any(Number),
        other: [],
    });
};

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
        country: {
            id: jasmine.any(String),
            name: jasmine.any(String),
        },
        region: {
            id: jasmine.anything(),
            name: jasmine.any(String),
        },
        town: {
            id: jasmine.any(Number),
            name: jasmine.any(String),
        }
    };

    describe("getter output", () => {

        it("should return number of pages", () => {
            expect(scheduledTitle.output.numberOfPages).toBeGreaterThanOrEqual(0);
        });

        describe("is division page", () => {

            describe("getter bouts", () => {

                let firstBout: BoxrecPageTitlesRowOutput;

                beforeAll(() => {
                    firstBout = superMiddleweightTitle.output.bouts[0];
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
                    linksTestObject(firstBout.links);
                });
            });
        });

        describe("is scheduled titles page", () => {

            describe("is selected title", () => {

                describe("getter bouts", () => {

                    let firstBout: BoxrecPageTitlesRowOutput;

                    beforeAll(() => {
                        firstBout = scheduledTitle.output.bouts[0];
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
                        linksTestObject(firstBout.links);
                    });
                });
            });

            describe("all titles", () => {

                describe("getter bouts", () => {

                    let firstBout: BoxrecPageTitlesRowOutput;

                    beforeAll(() => {
                        firstBout = allTitleAllSchedule.output.bouts[0];
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
                        linksTestObject(firstBout.links);
                    });
                });
            });
        });
    });
});
