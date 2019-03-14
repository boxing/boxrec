import {BoxrecLocation} from "../boxrec-pages/boxrec.constants";
import {Country} from "../boxrec-pages/location/people/boxrec.location.people.constants";
import {BoxrecCommonTablesColumnsClass} from "./boxrec-common-tables-columns.class";

describe("class BoxrecCommonTablesColumnsClass", () => {

    describe("method parseLocationLink", () => {

        it("parsing a link with one link that is a country should return the country", () => {
            const html: string = `<a href="/en/locations/event?country=US">USA</a>`;
            const location: BoxrecLocation = BoxrecCommonTablesColumnsClass.parseLocationLink(html);
            expect(location.country).toBe(Country.USA);
            expect(location.region).toBeNull();
            expect(location.id).toBeNull(); // id can be null
        });

        it("should return all values if they exist", () => {
            const html: string = `<div style="width:70%;float:left;">
                <div class="flag us"></div>
                <a href="/en/venue/246559">T-Mobile Arena</a>,
                <a href="/en/locations/event?country=US&amp;region=NV&amp;town=20388">Las Vegas</a>,
                <a href="/en/locations/event?country=US&amp;region=NV">Nevada</a>,
                <a href="/en/locations/event?country=US">USA</a>
                </div>`;
            const location: BoxrecLocation = BoxrecCommonTablesColumnsClass.parseLocationLink(html);
            expect(location.country).toBe(Country.USA);
            expect(location.region).toBe("NV");
            expect(location.town).toBe("Las Vegas");
            expect(location.id).toBe(20388);
        });

    });

});
