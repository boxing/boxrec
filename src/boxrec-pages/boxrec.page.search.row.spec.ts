import {BoxrecPageSearchRow} from "./boxrec.page.search.row";
import {boxRecMocksModulePath, WinLossDraw} from "./boxrec.constants";

const fs = require("fs");
const mockSearchResults = fs.readFileSync(`${boxRecMocksModulePath}/search/mockSearchRowMayweather.html`, "utf8");

describe("class BoxrecPageSearchRow", () => {

    let searchResult: BoxrecPageSearchRow;

    beforeAll(() => {
        searchResult = new BoxrecPageSearchRow(mockSearchResults);
    });

    describe("getter id", () => {

        it("should return the id of the boxer", () => {
            expect(searchResult.id).toBe(352);
        });

    });

    describe("getter alias", () => {

        it("should return the alias of the boxer", () => {
            expect(searchResult.alias).toBe("Money / Pretty Boy");
        });

    });

    describe("getter record", () => {

        it("should return the record of the boxer", () => {
            expect(searchResult.record.win).toBe(50);
            expect(searchResult.record.loss).toBe(0);
            expect(searchResult.record.draw).toBe(0);
        });

    });

    describe("getter last6", () => {

        it("should return the results of the last 6 of the boxer", () => {
            expect(searchResult.last6[0]).toBe(WinLossDraw.win);
        });

    });

    describe("getter division", () => {

        it("should return the division of the boxer", () => {
            expect(searchResult.division).toBe("welterweight");
        });

    });

    describe("getter career", () => {

        it("should be a length of two", () => {
            expect(searchResult.career).toHaveLength(2);
        });

        it("should have the start date", () => {
            expect(searchResult.career[0]).toBe(1996);
        });

        it("should have the end date", () => {
            expect(searchResult.career[1]).toBe(2017);
        });

    });

    describe("getter residence", () => {

        it("should return the town", () => {
            expect(searchResult.residence.town).toBe("Las Vegas");
        });

        it("should return the region", () => {
            expect(searchResult.residence.region).toBe("NV");
        });

        it("should return the country", () => {
            expect(searchResult.residence.country).toBe("US");
        });

    });

});
