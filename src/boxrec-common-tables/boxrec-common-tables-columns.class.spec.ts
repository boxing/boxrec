import {Country} from 'boxrec-requests';
import {BoxrecLocation} from '../boxrec-pages/boxrec.constants';
import {BoxrecCommonTablesColumnsClass} from './boxrec-common-tables-columns.class';

describe('class BoxrecCommonTablesColumnsClass', () => {

    describe('method parseLocationLink', () => {

        it('parsing a link with one link that is a country should return the country', () => {
            const html: string = `<a href="/en/locations/event?country=US">USA</a>`;
            const location: BoxrecLocation = BoxrecCommonTablesColumnsClass.parseLocationLink(html);
            expect(location.country).toEqual({
                id: Country.USA,
                name: 'USA',
            });
            expect(location.region).toEqual({
                id: null,
                name: null,
            });
        });

        it('should return all values if they exist', () => {
            const html: string = `<div style="width:70%;float:left;">
                <div class="flag us"></div>
                <a href="/en/venue/246559">T-Mobile Arena</a>,
                <a href="/en/locations/event?country=US&amp;region=NV&amp;town=20388">Las Vegas</a>,
                <a href="/en/locations/event?country=US&amp;region=NV">Nevada</a>,
                <a href="/en/locations/event?country=US">USA</a>
                </div>`;
            const location: BoxrecLocation = BoxrecCommonTablesColumnsClass.parseLocationLink(html);
            expect(location.country.id).toBe(Country.USA);
            expect(location.region.id).toBe('NV');
            expect(location.town.name).toBe('Las Vegas');
        });

    });

});
