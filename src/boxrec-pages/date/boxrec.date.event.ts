import {BoxrecEvent} from "../event/boxrec.event";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Used by the BoxRec Date page for event information
 */
export class BoxrecDateEvent extends BoxrecEvent {

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        this.parseLocation();
        this.parseId();
    }

    get id(): number {
        return parseInt(this._id, 10);
    }

    private parseId(): void {
        const wikiHref: string | null = $("h2").next().find(".eventP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                this._id = wikiLink[1];
            }
        }
    }

    private parseLocation(): void {
        this._location = $("h2").html();
    }

}
