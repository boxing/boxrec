import {BoxrecPageRatings} from "./boxrec.page.ratings";

const fs = require("fs");
const mockRatings = fs.readFileSync("./src/boxrec-pages/mocks/mockRatings.html", "utf8");

describe("class BoxrecPageRatings", () => {

    let ratings: BoxrecPageRatings;

    beforeAll(() => {
        ratings = new BoxrecPageRatings(mockRatings);
    });

    describe("getter get", () => {

        it("should return an array of ratings", () => {
            expect(ratings.get.length).not.toBe(0);
        });

    });

});