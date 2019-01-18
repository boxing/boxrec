import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";

export abstract class BoxrecTitlesCommon {

    protected readonly $: CheerioStatic;

    protected constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    get links(): BoxrecGeneralLinks {
        const html: Cheerio = this.parseLinks();
        // the links returned could contain `bio_closed` or `bio_open` as well
        // `bio_open` for events that haven't concluded.  `bio_closed` for belt/division selected
        const obj: BoxrecGeneralLinks = {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = this.$(elem).find("div");
            const href: string = this.$(elem).attr("href");
            const hrefArr: string[] = div.attr("class").split(" ");
            return BoxrecCommonLinks.parseLinks<BoxrecGeneralLinks>(hrefArr, href, obj);
        });

        return obj;
    }

    protected parseLinks(): Cheerio {
        throw new Error("Needs to be overridden by child class");
    }

}
