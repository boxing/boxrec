import {BoxrecLocation} from "../boxrec-pages/boxrec.constants";
import {Country} from "../boxrec-pages/location/people/boxrec.location.people.constants";
import {BoxrecCommonTablesColumnsClass} from "./boxrec-common-tables-columns.class";
import {BoxrecTitles} from "./boxrec-common.constants";

describe("class BoxrecCommonTablesColumnsClass", () => {

    describe("method parseLocationLink", () => {

        it("parsing a link with one link that is a country should return the country", () => {
            const html: string = `<a href="/en/locations/event?country=US">USA</a>`;
            const location: BoxrecLocation = BoxrecCommonTablesColumnsClass.parseLocationLink(html);
            expect(location.country).toEqual({
                id: Country.USA,
                name: "USA",
            });
            expect(location.region).toEqual({
                id: null,
                name: null,
            });
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
            expect(location.country.id).toBe(Country.USA);
            expect(location.region.id).toBe("NV");
            expect(location.town.name).toBe("Las Vegas");
        });

    });

    describe("method parseTitles", () => {

        it("should be able to parse titles with spaces (ex. Light%20Middleweight)", () => {
            const htmlString: string =
                `<div class="titleColor"><a href="/en/title/43/Welterweight" class="titleLink">
World Boxing Association Super World Welterweight Title</a> (supervisor:
 <a href="/en/supervisor/538042">Gilberto Jesus Mendoza</a>)<br>
<a href="/en/title/6/Light%20Middleweight" class="titleLink">World Boxing Council World Super Welterweight Title</a><br>
<a href="/en/title/6/Welterweight" class="titleLink">World Boxing Council World Welterweight Title</a></div>`;
            const titles: BoxrecTitles[] = BoxrecCommonTablesColumnsClass.parseTitles(htmlString);
            expect(titles.find(item => item.name === "World Boxing Council World Super Welterweight Title"))
                .toBeDefined();
        });

    });

});
