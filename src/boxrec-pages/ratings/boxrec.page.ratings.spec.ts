import {BoxrecPageRatings} from "./boxrec.page.ratings";
import {boxRecMocksModulePath} from "../boxrec.constants";

const fs = require("fs");
const mockRatings = fs.readFileSync(`${boxRecMocksModulePath}/ratings/mockRatings.html`, "utf8");

describe("class BoxrecPageRatings", () => {

    let ratings: BoxrecPageRatings;

    beforeAll(() => {
        ratings = new BoxrecPageRatings(mockRatings);
    });

    describe("getter get", () => {

        it("should return an array of ratings", () => {
            expect(ratings.output.length).not.toBe(0);
        });

    });

});
