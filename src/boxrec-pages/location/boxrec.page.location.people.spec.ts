import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import * as fs from "fs";
import {BoxrecPageLocationPeople} from "./boxrec.page.location.people";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";
import {Country} from "./boxrec.location.constants";

const mockLocation: string = fs.readFileSync(`${boxRecMocksModulePath}/location/mockUSALocation.html`, "utf8");

describe("class BoxrecPageLocationPeople", () => {

    let location: BoxrecPageLocationPeople;

    beforeAll(() => {
        location = new BoxrecPageLocationPeople(mockLocation);
    });

    describe("getter output", () => {

        it("should return an array of location data", () => {
            expect(location.output.length).toBeGreaterThan(0);
        });

        describe("output values", () => {

            let locationOutput: BoxrecPageLocationPeopleRow;

            beforeAll(() => {
                locationOutput = location.output[1];
            });

            describe("getter id", () => {

                it("should return the id", () => {
                    expect(locationOutput.id).toEqual(jasmine.any(Number));
                });

            });

            describe("getter name", () => {

                it("should return the boxer name", () => {
                    expect(locationOutput.name).toEqual(jasmine.any(String));
                });

            });

            describe("getter miles", () => {

                it("should return the distance the person is from this location", () => {
                    expect(locationOutput.miles).toBeGreaterThanOrEqual(0);
                });

            });

            describe("getter record", () => {

                it("should return the person's record", () => {
                    const keys: string[] = Object.keys(locationOutput.record);
                    expect(keys).toContain(WinLossDraw.win);
                    expect(keys).toContain(WinLossDraw.draw);
                    expect(keys).toContain(WinLossDraw.loss);
                    expect(locationOutput.record.win).toBeGreaterThanOrEqual(0);
                });

            });

            describe("getter location", () => {

                it("should return the country of this person", () => {
                    expect(locationOutput.location.country).toBe(Country.USA);
                });

                it("might not return the id", () => {
                    expect(locationOutput.location.id).toBeNull();
                });

                it("might not return the region", () => {
                    expect(locationOutput.location.region).toBeNull();
                });

                it("might not return the town", () => {
                    expect(locationOutput.location.town).toBeNull();
                });

            });

            describe("getter sex", () => {

                it("should return the sex of this person", () => {
                    expect(["male", "female"]).toContain(locationOutput.sex);
                });

            });

            describe("getter career", () => {

                it("should return when the person's was active in boxing", () => {
                    expect(locationOutput.career).toEqual([jasmine.any(Number), jasmine.any(Number)]);
                });

            });

        });

    });

});
