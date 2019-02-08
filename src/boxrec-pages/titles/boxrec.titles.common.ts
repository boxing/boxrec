import {BoxrecCommonLinks} from "@boxrec-common-tables/boxrec-common-links";
import {BoxrecGeneralLinks} from "@boxrec-common-tables/boxrec-common.constants";
import * as cheerio from "cheerio";

export abstract class BoxrecTitlesCommon {

    protected readonly $: CheerioStatic;

    protected constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    get links(): BoxrecGeneralLinks {
        return BoxrecCommonLinks.parseLinkInformation<BoxrecGeneralLinks>(this.parseLinks(), {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        });
    }

    protected parseLinks(): Cheerio {
        throw new Error("Needs to be overridden by child class");
    }

}
