import {
    mockActiveAndInactiveNoDivisionRatings,
    mockActiveAndInactiveRatings,
    mockNoDivisionRatings,
    mockRatings,
} from "boxrec-mocks";
import {WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageRatings} from "./boxrec.page.ratings";
import {BoxrecPageRatingsActiveDivisionRow} from "./boxrec.page.ratings.active-division.row";
import {BoxrecPageRatingsActiveInactiveDivisionRow} from "./boxrec.page.ratings.active-inactive-division.row";
import {
    BoxrecPageRatingsActiveAllDivisionsRowOutput,
    BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput
} from "./boxrec.ratings.constants";

describe("class BoxrecPageRatings", () => {

    let ratings: BoxrecPageRatings;
    let ratingsDivisionActiveInactive: BoxrecPageRatings;
    let ratingsAllDivisionsActiveInactive: BoxrecPageRatings;
    let ratingsAllDivisionsActive: BoxrecPageRatings;

    beforeAll(() => {
        ratings = new BoxrecPageRatings(mockRatings);
        ratingsDivisionActiveInactive = new BoxrecPageRatings(mockActiveAndInactiveRatings);
        ratingsAllDivisionsActiveInactive = new BoxrecPageRatings(mockActiveAndInactiveNoDivisionRatings);
        ratingsAllDivisionsActive = new BoxrecPageRatings(mockNoDivisionRatings);
    });

    describe("active boxers with division", () => {

        describe("getter boxers", () => {

            it("should return an array of ratings", () => {
                expect(ratings.boxers.length).toBeGreaterThan(0);
            });

            describe("output values", () => {

                let ratingsOutput: BoxrecPageRatingsActiveDivisionRow;

                beforeAll(() => {
                    ratingsOutput = ratings.boxers[0] as BoxrecPageRatingsActiveDivisionRow;
                });

                describe("getter id", () => {

                    it("should return the id", () => {
                        expect(ratingsOutput.id).toEqual(jasmine.any(Number));
                    });

                });

                describe("getter name", () => {

                    it("should return the boxer name", () => {
                        expect(ratingsOutput.name).toEqual(jasmine.any(String));
                    });

                });

                describe("getter points", () => {

                    it("should return the points of the boxer", () => {
                        expect(ratingsOutput.points).toEqual(jasmine.any(Number));
                    });

                });

                describe("getter rating", () => {

                    it("should return the rating of the boxer", () => {
                        expect(ratingsOutput.rating).toEqual(jasmine.any(Number));
                    });

                });

                describe("getter hasBoutScheduled", () => {

                    it("should return if the boxer has a fight scheduled", () => {
                        expect(ratingsOutput.hasBoutScheduled).toEqual(jasmine.any(Boolean));
                    });

                });

                describe("getter age", () => {

                    it("should return the age of the boxer", () => {
                        expect(ratingsOutput.age).toEqual(jasmine.any(Number));
                    });

                });

                describe("getter record", () => {

                    it("should return the record of the boxer", () => {
                        expect(ratingsOutput.record).toEqual({
                            draw: jasmine.any(Number),
                            loss: jasmine.any(Number),
                            win: jasmine.any(Number),
                        });
                    });

                });

                describe("getter last6", () => {

                    it("should return an array", () => {
                        expect(ratingsOutput.last6[0]).toEqual(WinLossDraw.win);
                    });

                });

                describe("getter stance", () => {

                    it("should return the stance", () => {
                        expect(["orthodox", "southpaw"]).toContain(ratingsOutput.stance);
                    });

                });

                describe("getter residence", () => {

                    const obj: { id: any, name: any } = {
                        id: jasmine.anything(),
                        name: jasmine.any(String),
                    };

                    it("should return the country", () => {
                        expect(ratingsOutput.residence.country).toEqual(obj);
                    });

                    it("should return the region", () => {
                        expect(ratingsOutput.residence.region).toEqual(obj);
                    });

                    it("should return the town", () => {
                        expect(ratingsOutput.residence.town).toEqual(obj);
                    });

                });

            });

        });

    });

    describe("active/inactive boxers with division", () => {

        describe("getter boxers", () => {

            it("should return an array of ratings", () => {
                expect(ratingsDivisionActiveInactive.boxers.length).toEqual(50);
            });

            describe("output values", () => {

                let ratingsOutput: BoxrecPageRatingsActiveInactiveDivisionRow;

                beforeAll(() => {
                    ratingsOutput =
                        ratingsDivisionActiveInactive.boxers[0].output as BoxrecPageRatingsActiveInactiveDivisionRow;
                });

                describe("getter career", () => {

                    it("should return the start date", () => {
                        expect(ratingsOutput.career[0]).toEqual(jasmine.any(Number));
                    });

                    it("should return the end date", () => {
                        expect(ratingsOutput.career[1]).toEqual(jasmine.any(Number));
                    });

                });

                describe("getter record", () => {

                    it("should return the record", () => {
                        // this test is more to ensure that columns are correct
                        expect(ratingsOutput.record).toEqual({
                            draw: jasmine.any(Number),
                            loss: jasmine.any(Number),
                            win: jasmine.any(Number),
                        });
                    });

                });

                describe("getter residence", () => {

                    it("should return the residence", () => {
                        expect(ratingsOutput.residence.country.name).not.toBeNull();
                    });

                });

            });

        });

    });

    describe("active/inactive boxers ALL divisions", () => {

        describe("getter boxers", () => {

            it("should return an array of ratings", () => {
                // there are ads as table rows and we want to ensure we only get the rows we actually care about
                expect(ratingsAllDivisionsActiveInactive.boxers.length).toEqual(50);
            });

            describe("output values", () => {

                let ratingsOutput: BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput;

                beforeAll(() => {
                    ratingsOutput = ratingsAllDivisionsActiveInactive.boxers[0].output as
                        BoxrecPageRatingsActiveInactiveAllDivisionsRowOutput;
                });

                describe("getter division", () => {

                    it("should return the division", () => {
                        expect(Object.values(WeightDivision)).toContain(ratingsOutput.division);
                    });

                });

            });

        });

    });

    describe("active boxers ALL divisions (P4P)", () => {

        describe("getter boxers", () => {

            it("should return an array of ratings", () => {
                // there are ads as table rows and we want to ensure we only get the rows we actually care about
                expect(ratingsAllDivisionsActive.boxers.length).toEqual(50);
            });

            describe("output values", () => {

                let ratingsOutput: BoxrecPageRatingsActiveAllDivisionsRowOutput;

                beforeAll(() => {
                    ratingsOutput = ratingsAllDivisionsActive.boxers[0].output as
                        BoxrecPageRatingsActiveAllDivisionsRowOutput;
                });

                describe("getter division", () => {

                    it("should return the division", () => {
                        expect(Object.values(WeightDivision)).toContain(ratingsOutput.division);
                    });

                });

                describe("getter age", () => {

                    it("should return the age", () => {
                        expect(ratingsOutput.age).toBeGreaterThan(0);
                    });

                });

                describe("getter rating", () => {

                    it("should return the rating", () => {
                        expect(ratingsOutput.rating).toBeGreaterThanOrEqual(0);
                    });

                });

            });

        });

    });

});
