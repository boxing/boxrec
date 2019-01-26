import {mockUSALocation} from "boxrec-mocks";
import {WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {Country} from "./boxrec.location.people.constants";
import {BoxrecPageLocationPeople} from "./boxrec.page.location.people";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

describe("class BoxrecPageLocationPeople", () => {

    let location: BoxrecPageLocationPeople;

    beforeAll(() => {
        location = new BoxrecPageLocationPeople(mockUSALocation);
    });

    describe("getter numberOfPages", () => {

        it("should return a number", () => {
            expect(location.numberOfPages).toBeGreaterThanOrEqual(1);
        });

    });

    describe("getter boxers", () => {

        it("should return an array of location data", () => {
            expect(location.boxers.length).toBeGreaterThan(0);
        });

        describe("output values", () => {

            let locationOutput: BoxrecPageLocationPeopleRow;

            beforeAll(() => {
                locationOutput = location.boxers[1];
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

            describe("getter division", () => {
                const weightDivisionValues: string[] = Object.values(WeightDivision);

                it("should return the boxer division", () => {
                    location.boxers.forEach(boxer => {
                        if (boxer.division) {
                            expect(weightDivisionValues).toContain(boxer.division);
                        } else {
                            expect(boxer.division).toBeNull();
                        }

                    });
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
