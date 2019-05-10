import {mockUSALocation} from "boxrec-mocks";
import {BoxrecPageLocationPeople} from "./boxrec.page.location.people";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

describe("class BoxrecPageLocationPeople", () => {

    let location: BoxrecPageLocationPeople;

    beforeAll(() => {
        location = new BoxrecPageLocationPeople(mockUSALocation);
    });

    describe("getter people", () => {

        it("should return an array of location data", () => {
            expect(location.people.length).toBeGreaterThan(0);
        });

        describe("output values", () => {

            let locationOutput: BoxrecPageLocationPeopleRow;

            beforeAll(() => {
                locationOutput = location.people[1];
            });

            it("career should be undefined", () => {
                expect(locationOutput.career).not.toBeDefined();
            });

            it("division should be undefined", () => {
                expect(locationOutput.division).not.toBeDefined();
            });

            it("record should be undefined", () => {
                expect(locationOutput.record).not.toBeDefined();
            });

        });

    });

});
