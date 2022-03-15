import {mockSearchMayweather} from "boxrec-mocks";
import {BoxrecFighterRole} from "boxrec-requests";
import {WinLossDraw} from "../boxrec.constants";
import {BoxrecPageSearch} from "./boxrec.page.search";
import {BoxrecSearch} from "./boxrec.search.constants";

describe("class BoxrecPageSearch", () => {

    let searchResults: BoxrecPageSearch;

    beforeAll(() => {
        searchResults = new BoxrecPageSearch(mockSearchMayweather);
    });

    describe("getter output", () => {

        describe("getter results", () => {

            describe("output values", () => {

                let floydJrOutput: BoxrecSearch;

                beforeAll(() => {
                    floydJrOutput = searchResults.output.results[1]; // Floyd Mayweather Jr
                });

                describe("getter id", () => {

                    it("should return the id of the boxer", () => {
                        expect(floydJrOutput.id).toBe(352);
                    });

                });

                describe("getter sport", () => {

                    // todo this should either be fine or return the URL role
                    xit("should return the sport", () => {
                        expect(floydJrOutput.sport).toBe(BoxrecFighterRole.proBoxer);
                    });

                });

                describe("getter name", () => {

                    it("should return the name of the boxer", () => {
                        expect(floydJrOutput.name).toBe("Floyd Mayweather Jr");
                    });

                });

                describe("getter alias", () => {

                    it("should return the alias of the boxer", () => {
                        expect(floydJrOutput.alias).toBe("Money / Pretty Boy");
                    });

                });

                describe("getter record", () => {

                    it("should return the record of the boxer", () => {
                        expect(floydJrOutput.record.win).toBe(50);
                        expect(floydJrOutput.record.loss).toBe(0);
                        expect(floydJrOutput.record.draw).toBe(0);
                    });

                });

                describe("getter last6", () => {

                    it("should return the results of the last 6 of the boxer", () => {
                        expect(floydJrOutput.last6[0]).toBe(WinLossDraw.win);
                    });

                });

                describe("getter division", () => {

                    // todo when person has multiple roles, it tells both careers/last6/divisions for that person
                    // ex. search `Hector Madera`
                    it("should return the division of the boxer", () => {
                        expect(floydJrOutput.division).toBe("welterweight");
                    });

                });

                describe("getter career", () => {

                    it("should be a length of two", () => {
                        expect(floydJrOutput.career).toHaveLength(2);
                    });

                    it("should have the start date", () => {
                        expect(floydJrOutput.career[0]).toBe(1996);
                    });

                    it("should have the end date", () => {
                        expect(floydJrOutput.career[1]).toBe(2017);
                    });

                });

                describe("getter residence", () => {

                    it("should return the town", () => {
                        expect(floydJrOutput.residence.town.name).toBe("Las Vegas");
                    });

                    it("should return the region", () => {
                        expect(floydJrOutput.residence.region.id).toBe("NV");
                    });

                    it("should return the country", () => {
                        expect(floydJrOutput.residence.country.id).toBe("US");
                    });

                });

            });

        });

    });
});
