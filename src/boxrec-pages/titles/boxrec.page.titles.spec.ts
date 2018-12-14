import * as fs from "fs";
import {boxRecMocksModulePath} from "../boxrec.constants";
import {BoxrecPageTitles} from "./boxrec.page.titles";
import {BoxrecPageTitlesRow} from "./boxrec.page.titles.row";

const mockTitlesSuperMiddleweight: string =
    fs.readFileSync(`${boxRecMocksModulePath}/titles/mockTitlesSuperMiddleweight.html`, "utf8");

describe("class BoxrecPageTitles", () => {

    let title: BoxrecPageTitles;

    beforeAll(() => {
        title = new BoxrecPageTitles(mockTitlesSuperMiddleweight);
    });

    describe("getter bouts", () => {

        let firstBout: BoxrecPageTitlesRow;

        beforeAll(() => {
            firstBout = title.bouts[0];
        });

        it("should have the date", () => {
            expect(firstBout.date).toMatch(/\d{4}-\d{2}-\d{2}/);
        });

        it("should have the location", () => {
            expect(firstBout.location).toEqual({
                country: jasmine.any(String),
                id: jasmine.any(Number),
                region: jasmine.any(String),
                town: jasmine.any(String),
            });
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
                bio_closed: jasmine.any(Number),
                bout: jasmine.any(String),
                event: jasmine.any(Number),
                other: [],
            });
        });

    });

});
