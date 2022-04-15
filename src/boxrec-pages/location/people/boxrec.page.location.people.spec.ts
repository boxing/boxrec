import {mockUSALocation} from 'boxrec-mocks';
import {BoxrecPageLocationPeople} from './boxrec.page.location.people';
import {BoxrecPageLocationPeopleRow} from './boxrec.page.location.people.row';

describe('class BoxrecPageLocationPeople', () => {

    let location: BoxrecPageLocationPeople;

    beforeAll(() => {
        location = new BoxrecPageLocationPeople(mockUSALocation);
    });

    describe('getter people', () => {

        it('should return an array of location data', () => {
            expect(location.people.length).toBeGreaterThan(0);
        });

        describe('output values', () => {

            let locationOutput: BoxrecPageLocationPeopleRow;

            beforeAll(() => {
                locationOutput = location.people[1];
            });

            it('miles should be a number and greater than or equal to zero', () => {
                expect(locationOutput.miles).toBeGreaterThanOrEqual(0);
            });

            it('name should be defined', () => {
                expect(locationOutput.name).toBeDefined();
            });

            it('sex should be defined', () => {
                expect(locationOutput.sex).toBe('male' || 'female');
            });

        });

    });

});
