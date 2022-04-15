import {mockEventsLondon2017} from 'boxrec-mocks';
import {BoxrecPageLocationEvent} from './boxrec.page.location.event';

describe('class BoxrecPageLocationEvent', () => {

    let events: BoxrecPageLocationEvent;

    beforeAll(() => {
        events = new BoxrecPageLocationEvent(mockEventsLondon2017);
    });

    describe('getter numberOfLocations', () => {

        it('should return a number', () => {
            expect(events.numberOfLocations).toBeGreaterThanOrEqual(1);
        });

    });

    describe('getter numberOfPages', () => {

        it('should return a number', () => {
            expect(events.numberOfPages).toBeGreaterThanOrEqual(1);
        });

    });

    describe('getter events', () => {

        it('should return an array of location data', () => {
            expect(events.events.length).toBeGreaterThan(0);
        });

        it('should include the date', () => {
            expect(events.events[0].date).toBe('2017-12-13');
        });

        it('should include the day of the fight', () => {
            expect(events.events[0].day).toBe('Wed');
        });

        it('should include the venue', () => {
            expect(events.events[0].venue.id).toBe(28315);
            expect(events.events[0].venue.name).toBe('York Hall');
        });

        describe('getter location', () => {

            it('should include the country', () => {
                expect(events.events[0].location.country).toEqual({
                    id: 'UK',
                    name: 'United Kingdom',
                });
            });

            it('should include the region', () => {
                expect(events.events[0].location.region).toEqual({
                    id: 'LON',
                    name: 'London',
                });
            });

            it('should include the town', () => {
                expect(events.events[0].location.town).toEqual({
                    id: 15689,
                    name: 'Bethnal Green',
                });
            });

        });

        it('should include the event id as id', () => {
            expect(events.events[0].id).toBe(759641);
        });

    });

});
