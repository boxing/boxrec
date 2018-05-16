import {boxRecMocksModulePath, WeightClass, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";

const fs = require("fs");
const mockRating = fs.readFileSync(`${boxRecMocksModulePath}/ratings/mockRating.html`, "utf8");
const mockRatingP4P = fs.readFileSync(`${boxRecMocksModulePath}/ratings/mockRatingP4P.html`, "utf8"); // when all weight classes are given, it includes weight class

describe("class BoxrecPageRatingsRow", () => {

    let rating: BoxrecPageRatingsRow;

    beforeAll(() => {
        rating = new BoxrecPageRatingsRow(mockRating);
    });

    describe("getter ranking", () => {

        it("should return the ranking", () => {
            expect(rating.ranking).toBe(2);
        });

    });

    describe("getter id", () => {

        it("should return the id", () => {
            expect(rating.id).toBe(629465);
        });

    });

    describe("getter name", () => {

        it("should return the boxer name", () => {
            expect(rating.name).toBe("Errol Spence Jr");
        });

    });

    describe("getter division", () => {

        it("should give the weight class if rating including all weight classes", () => {
            let ratingP4P = new BoxrecPageRatingsRow(mockRatingP4P);
            expect(ratingP4P.division).toBe(WeightClass.cruiserweight);
        });

        it("should return `null` as weight class if the weight class was specified because they know the weight class", () => {
            expect(rating.division).toBeNull();
        });

    });

    describe("getter hasBoutScheduled", () => {

        it("should return if the boxer has a fight scheduled", () => {
            expect(rating.hasBoutScheduled).toBe(true);
        });

    });

    describe("getter points", () => {

        it("should return the points of the boxer", () => {
            expect(rating.points).toBe(555);
        });

    });

    describe("getter rating", () => {

        it("should return the rating of the boxer", () => {
            expect(rating.rating).toBe(100);
        });

    });

    describe("getter age", () => {

        it("should return the age of the boxer", () => {
            expect(rating.age).toBe(28);
        });

    });

    describe("getter last6", () => {

        it("should return an array", () => {
            expect(rating.last6[0]).toBe(WinLossDraw.win);
        });

    });

    describe("getter stance", () => {

        it("should return the stance", () => {
            expect(rating.stance).toBe("southpaw");
        });

    });

    describe("getter residence", () => {

        it("should return the country", () => {
            expect(rating.residence.country).toBe("US");
        });

        it("should return the region", () => {
            expect(rating.residence.region).toBe("TX");
        });

        it("should return the town", () => {
            expect(rating.residence.town).toBe("Desoto");
        });

        it("should return null for values it cannot find", () => {
            rating = new BoxrecPageRatingsRow(mockRating.replace("region=TX", ""));
            expect(rating.residence.region).toBeNull();
        });

    });

});
