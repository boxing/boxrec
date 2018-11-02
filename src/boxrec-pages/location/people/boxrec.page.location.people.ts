import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

const cheerio: CheerioAPI = require("cheerio");

/**
 * parse a BoxRec Locate People results page
 * <pre>ex. http://boxrec.com/en/locations/people?l%5Brole%5D=boxer&l%5Bdivision%5D=&l%5Bcountry%5D=US&l%5Bregion%5D=&l%5Btown%5D=&l_go=</pre>
 */
export class BoxrecPageLocationPeople {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxers(): BoxrecPageLocationPeopleRow[] {
        return this.parseLocation().map(item => new BoxrecPageLocationPeopleRow(item));
    }

    private parseLocation(): string[] {
        const tr: Cheerio = this.$(".dataTable tbody tr");
        const locations: string[] = [];

        tr.each((i: number, elem: CheerioElement) => {
            const html: string = this.$(elem).html() || "";
            locations.push(html);
        });

        return locations;
    }

}
