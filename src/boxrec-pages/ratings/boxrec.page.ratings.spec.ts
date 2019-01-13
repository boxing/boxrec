import * as fs from "fs";
import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageRatings} from "./boxrec.page.ratings";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

const mockRatings: string = fs.readFileSync(`${boxRecMocksModulePath}/ratings/mockRatings.html`, "utf8");

describe("class BoxrecPageRatings", () => {

    let ratings: BoxrecPageRatings;

    beforeAll(() => {
        ratings = new BoxrecPageRatings(mockRatings);
    });

    describe("getter boxers", () => {

        it("should return an array of ratings", () => {
            expect(ratings.boxers.length).toBeGreaterThan(0);
        });

        describe("output values", () => {

            let ratingsOutput: BoxrecPageRatingsRow;

            beforeAll(() => {
                ratingsOutput = ratings.boxers[0];
            });

            describe("getter ranking", () => {

                it("should return the ranking", () => {
                    expect(ratingsOutput.ranking).toEqual(jasmine.any(Number));
                });

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

            describe("getter division", () => {

                it("should return `null` as weight class if the weight class was specified because they know the weight class", () => {
                    expect((Object as any).values([null])).toContain(ratingsOutput.division);
                });

            });

            describe("getter hasBoutScheduled", () => {

                it("should return if the boxer has a fight scheduled", () => {
                    expect(ratingsOutput.hasBoutScheduled).toEqual(jasmine.any(Boolean));
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

            describe("getter age", () => {

                it("should return the age of the boxer", () => {
                    expect(ratingsOutput.age).toEqual(jasmine.any(Number));
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

                it("should return the country", () => {
                    expect(ratingsOutput.residence.country).toEqual(jasmine.any(String));
                });

                it("should return the region", () => {
                    expect(ratingsOutput.residence.region).toEqual(jasmine.any(String));
                });

                it("should return the town", () => {
                    expect(ratingsOutput.residence.town).toEqual(jasmine.any(String));
                });

            });

        });

    });

});
