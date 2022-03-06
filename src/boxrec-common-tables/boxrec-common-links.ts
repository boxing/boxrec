import * as cheerio from "cheerio";
import {BoxrecGeneralLinks} from "./boxrec-common.constants";

const $: CheerioStatic = cheerio;

interface LinksObj {
    classAttr: string;
    div: Cheerio;
    href: string;
    hrefArr: string[];
}

export class BoxrecCommonLinks {

    /**
     * Loops through Cheerio object and gets link information.  Returns empty object if no links exist
     * @param {Cheerio} html
     * @param {T} obj
     * @returns {T}
     */
    static parseLinkInformation<T extends BoxrecGeneralLinks>(html: Cheerio, obj: T): T {
        html.find("a").each((i: number, elem: CheerioElement) => {
            const {href, hrefArr} = BoxrecCommonLinks.parseLinksColumn(elem);
            return BoxrecCommonLinks.parseLinks<T>(hrefArr, href, obj);
        });

        return obj;
    }

    /**
     * Takes a link column and returns the needed data to parse it
     * @param {CheerioElement} elem
     * @returns {LinksObj}
     * @todo a lot of this was necessary when the links had certain classes
     */
    static parseLinksColumn(elem: CheerioElement): LinksObj {
        const div: Cheerio = $(elem).find("div");
        const href: string = $(elem).attr("href");
        const classAttr: string = div.attr("class");

        const linkObj: LinksObj = {
            classAttr,
            div,
            href,
            hrefArr: [],
        };

        if (classAttr) {
            linkObj.hrefArr = classAttr.split(" ");
        }

        return linkObj;
    }

    /**
     * Takes a link, parses the information and returns the object
     * @param hrefArr
     * @param href
     * @param obj
     */
    private static parseLinks<T extends BoxrecGeneralLinks>(hrefArr: string[], href: string, obj: T): T {
        const hrefMatch: RegExpMatchArray | null = href.match(/([\/\d]+)$/);

        if (hrefMatch && hrefMatch[1]) {
            // todo this might not be necessary anymore and be kept because the mocks are out of date
            const link: string = hrefMatch[1].charAt(0) === "/" ? hrefMatch[1].substring(1) : hrefMatch[1];

            // todo other links?
            if (href.includes("/event/")) {
                if (/\d+\/\d+/.test(href)) {
                    obj.bout = link;
                } else {
                    obj.event = parseInt(link, 10);
                }
            } else if (href.includes("/media/")) {
                obj.bio = parseInt(link, 10);
            }
        }

        return obj;
    }

}
