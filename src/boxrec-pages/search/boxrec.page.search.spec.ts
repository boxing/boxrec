import * as fs from "fs";
import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import {BoxrecPageSearch} from "./boxrec.page.search";
import {BoxrecSearch} from "./boxrec.search.constants";

const mockSearchResults: string = fs.readFileSync(`${boxRecMocksModulePath}/search/mockSearchMayweather.html`, "utf8");

describe("class BoxrecPageSearch", () => {

    let searchResults: BoxrecPageSearch;

    beforeAll(() => {
        searchResults = new BoxrecPageSearch(mockSearchResults);
    });

    describe("getter results", () => {

        it("should return an array of search results", () => {
            expect(searchResults.results.length).not.toBe(0);
        });

        describe("output values", () => {

            let output: BoxrecSearch[];

            beforeAll(() => {
                output = searchResults.results; // Floyd Mayweather Jr.
            });

            describe("getter id", () => {

                it("should return the id of the boxer", () => {
                    expect(output[1].id).toBe(352);
                });

            });

            describe("getter name", () => {

                it("should return the name of the boxer", () => {
                    expect(output[1].name).toBe("Floyd Mayweather Jr");
                });

            });

            describe("getter alias", () => {

                it("should return the alias of the boxer", () => {
                    expect(output[1].alias).toBe("Money / Pretty Boy");
                });

            });

            describe("getter record", () => {

                it("should return the record of the boxer", () => {
                    expect(output[1].record.win).toBe(50);
                    expect(output[1].record.loss).toBe(0);
                    expect(output[1].record.draw).toBe(0);
                });

            });

            describe("getter last6", () => {

                it("should return the results of the last 6 of the boxer", () => {
                    expect(output[1].last6[0]).toBe(WinLossDraw.win);
                });

            });

            describe("getter division", () => {

                it("should return the division of the boxer", () => {
                    expect(output[1].division).toBe("welterweight");
                });

            });

            describe("getter career", () => {

                it("should be a length of two", () => {
                    expect(output[1].career).toHaveLength(2);
                });

                it("should have the start date", () => {
                    expect(output[1].career[0]).toBe(1996);
                });

                it("should have the end date", () => {
                    expect(output[1].career[1]).toBe(2017);
                });

            });

            describe("getter residence", () => {

                it("should return the town", () => {
                    expect(output[1].residence.town).toBe("Las Vegas");
                });

                it("should return the region", () => {
                    expect(output[1].residence.region).toBe("NV");
                });

                it("should return the country", () => {
                    expect(output[1].residence.country).toBe("US");
                });

            });

        });

    });

});
