import {mockUSALocation} from "boxrec-mocks";
import {Country} from "boxrec-requests";
import {WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxrecPageLocationBoxer} from "./boxrec.page.location.boxer";
import {BoxrecPageLocationBoxerRow} from "./boxrec.page.location.boxer.row";

describe("class BoxrecPageLocationBoxer", () => {

    let location: BoxrecPageLocationBoxer;

    beforeAll(() => {
        location = new BoxrecPageLocationBoxer(mockUSALocation);
    });

    describe("getter numberOfPages", () => {

        it("should return a number", () => {
            expect(location.numberOfPages).toBeGreaterThanOrEqual(1);
        });

    });

    describe("getter numberOfPeople", () => {

        it("should return a number", () => {
            expect(location.numberOfPeople).toBeGreaterThanOrEqual(1);
        });

    });

    describe("getter people", () => {

        it("should return an array of location data", () => {
            expect(location.people.length).toBeGreaterThan(0);
        });

        describe("output values", () => {

            let locationOutput: BoxrecPageLocationBoxerRow;

            beforeAll(() => {
                locationOutput = location.people[1];
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
                    location.people.forEach(boxer => {
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
                const nullValues: { id: null, name: null } = {
                    id: null,
                    name: null,
                };

                it("should return the country of this person", () => {
                    expect(locationOutput.location.country).toEqual({
                        id: Country.USA,
                        name: "USA",
                    });
                });

                it("might not return the region", () => {
                    expect(locationOutput.location.region).toEqual(nullValues);
                });

                it("might not return the town", () => {
                    expect(locationOutput.location.town).toEqual(nullValues);
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

            describe("getter last6", () => {

                it("should return the result of the last 6 bouts", () => {
                    expect(Object.values(WinLossDraw)).toContain(locationOutput.last6[0]);
                });

            });

        });

    });

});
