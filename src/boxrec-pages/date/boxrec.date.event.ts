import {BoxrecEvent} from "../event/boxrec.event";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Used by the BoxRec Date page for event information
 */
export class BoxrecDateEvent extends BoxrecEvent {

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
        this.parseLocation();
    }

    get id(): number {
        return parseInt(this.parseId(), 10);
    }

    private parseId(): string {
        const wikiHref: string | null = this.$("h2").next().find(".eventP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                return wikiLink[1];
            }
        }

        throw new Error("Could not find Event ID");
    }

    private parseLocation(): void {
        this._location = this.$("h2").html();
    }

}
