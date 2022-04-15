import {mockDate20100520, mockDate20191116} from 'boxrec-mocks';
import {WinLossDraw} from '../boxrec.constants';
import {BoxrecPageEventBoutRow} from '../event/boxrec.page.event.bout.row';
import {BoxrecDateEvent} from './boxrec.date.event';
import {BoxrecPageDate} from './boxrec.page.date';
import {BoxrecDateOutput} from './boxrec.page.date.constants';

describe('class BoxrecPageDate', () => {

    let date20100520: BoxrecDateOutput;
    let date20191116: BoxrecDateOutput;

    beforeAll(() => {
        date20100520 = new BoxrecPageDate(mockDate20100520).output;
        date20191116 = new BoxrecPageDate(mockDate20191116).output;
    });

    describe('getter events', () => {

        it('should return an array of search results', () => {
            expect(date20100520.events.length).toBeGreaterThan(0);
        });

        describe('event values', () => {

            let firstEvent: BoxrecDateEvent;

            beforeAll(() => {
                firstEvent = date20100520.events[0];
            });

            describe('getter location', () => {

                describe('venue', () => {

                    it('should return the id and name of the venue', () => {
                        const {id, name} = firstEvent.location.venue;
                        expect(id).toBe(3258);
                        expect(name).toBe('Leagues Club');
                    });

                });

                describe('location', () => {

                    it('should return the location', () => {
                        const {town, region, country} = firstEvent.location.location;
                        expect(country.name).toBe('Australia');
                        expect(town.name).toBe('Parramatta');
                        expect(region.name).toBe('New South Wales');
                    });

                });

            });

            describe('getter matchmakers', () => {

                it('should be defined but does not exist on page, should be empty array', () => {
                    expect(firstEvent.matchmakers.length).toBe(0);
                });

            });

            describe('getter tickets', () => {

                it('should return tickets if it exists', () => {
                    expect(date20191116.events[0].tickets).toBe('Paul - 0413812274 - 6pm start');
                });

                it('should return null if does not exist', () => {
                    expect(firstEvent.tickets).toBeNull();
                });

            });

            describe('getter id', () => {

                it('should return the event id', () => {
                    expect(firstEvent.id).toBe(600051);
                });

            });

            describe('getter bouts', () => {

                let firstEventFirstBout: BoxrecPageEventBoutRow;

                beforeAll(() => {
                    firstEventFirstBout = firstEvent.bouts[0];
                });

                it('should return the first boxer information', () => {
                    expect(firstEventFirstBout.firstBoxer.name).toBe('Vic Darchinyan');
                    expect(firstEventFirstBout.firstBoxer.id).toBe(42089);
                });

                it('should have the firstBoxerWeightDefined', () => {
                    // This will be null for future dates
                    // This might be null event for small events
                    expect(firstEventFirstBout.firstBoxerWeight).toBeDefined();
                });

                it('should return the first boxer\'s record', () => {
                    expect(firstEventFirstBout.firstBoxerRecord).toEqual({
                        draw: 1,
                        loss: 2,
                        win: 34,
                    });
                });

                it('should return the first boxer\'s last 6 results', () => {
                    expect(firstEventFirstBout.firstBoxerLast6).toEqual([
                        WinLossDraw.win,
                        WinLossDraw.win,
                        WinLossDraw.win,
                        WinLossDraw.loss,
                        WinLossDraw.win,
                        WinLossDraw.win
                    ]);
                });

                it('should return the result of the bout for the first boxer', () => {
                    expect(firstEventFirstBout.outcome).toBe(WinLossDraw.win);
                });

                it('should return the outcome of the bout', () => {
                    expect(firstEventFirstBout.outcomeByWayOf).toBe('UD');
                });

                it('should return the number of rounds', () => {
                    expect(firstEventFirstBout.numberOfRounds).toEqual([12, 12]);
                });

                it('should return the opponent', () => {
                    expect(firstEventFirstBout.secondBoxer.id).toBe(84810);
                    expect(firstEventFirstBout.secondBoxer.name).toBe('Eric Barcelona');
                });

                it('should return the second boxer\'s weight', () => {
                    expect(firstEventFirstBout.secondBoxerWeight).toBe(117.5);
                });

                it('should return the second boxer\'s record', () => {
                    expect(firstEventFirstBout.secondBoxerRecord).toEqual({
                        draw: 5,
                        loss: 17,
                        win: 50,
                    });
                });

                it('should return the second boxer\'s last 6', () => {
                    expect(firstEventFirstBout.secondBoxerLast6).toEqual([
                        WinLossDraw.win,
                        WinLossDraw.loss,
                        WinLossDraw.win,
                        WinLossDraw.win,
                        WinLossDraw.win,
                        WinLossDraw.loss,
                    ]);
                });

                it('should return links of the bout', () => {
                    expect(firstEventFirstBout.links.bout).toBe('600051/1513428');
                });

                it('should return the wiki link', () => {
                    expect(firstEventFirstBout.links.bio).toBe(1513428);
                });

            });

        });

    });

});
