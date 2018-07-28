import {BoxrecRole} from "../../search/boxrec.search.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * parse a BoxRec Locate People results page
 * <pre>ex. http://boxrec.com/en/locations/people?l%5Brole%5D=boxer&l%5Bdivision%5D=&l%5Bcountry%5D=US&l%5Bregion%5D=&l%5Btown%5D=&l_go=</pre>
 */
export class BoxrecPageLocationPeople {

    role: BoxrecRole;

    private _locations: string[] = [];

    constructor(boxrecBodyString: string, role: BoxrecRole = BoxrecRole.boxer) {
        $ = cheerio.load(boxrecBodyString);
        this.role = role;
        this.parseLocation();
    }

    get boxers(): BoxrecPageLocationPeopleRow[] {
        return this._locations.map(item => new BoxrecPageLocationPeopleRow(item, this.role));
    }

    private parseLocation(): void {
        const tr: Cheerio = $("table#locationsTable tbody tr");
        tr.each((i: number, elem: CheerioElement) => {
            const html: string = $(elem).html() || "";
            this._locations.push(html);
        });
    }

}
