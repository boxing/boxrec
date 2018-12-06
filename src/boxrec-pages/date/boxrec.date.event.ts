import {BoxrecEvent} from "../event/boxrec.event";
import {BoxrecRole} from "../search/boxrec.search.constants";

const cheerio: CheerioAPI = require("cheerio");

/**
 * Used by the BoxRec Date page for event information
 */
export class BoxrecDateEvent extends BoxrecEvent {

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get id(): number {
        return parseInt(this.parseId(), 10);
    }

    protected parseLocation(): string {
        return this.$("h2").html() as string;
    }

    protected parsePromoters(): string {
        return this.parseEventData(BoxrecRole.promoter);
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

}
