import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecTitleLinks} from "../title/boxrec.title.common";

export abstract class BoxrecTitlesCommon {

    protected readonly $: CheerioStatic;

    constructor(html: string) {
        this.$(html);
    }


    protected links(html: Cheerio): BoxrecTitleLinks {
        const obj: BoxrecTitleLinks = {
            bio_closed: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = this.$(elem).find("div");
            const href: string = this.$(elem).attr("href");
            const classAttr: string = div.attr("class");
            const hrefArr: string[] = classAttr.split(" ");

            return BoxrecCommonLinks.parseLinks<BoxrecTitleLinks>(hrefArr, href, obj);
        });

        return obj;
    }

}