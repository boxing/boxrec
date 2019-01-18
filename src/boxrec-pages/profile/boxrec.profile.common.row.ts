import * as cheerio from "cheerio";
import {BoxrecCommonLinks} from "../../boxrec-common-tables/boxrec-common-links";
import {BoxrecGeneralLinks} from "../../boxrec-common-tables/boxrec-common.constants";

// contains common functionality of profiles rows
export abstract class BoxrecProfileCommonRow {

    protected readonly $: CheerioStatic;

    constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    get links(): BoxrecGeneralLinks {
        const html: Cheerio = this.parseLinks();
        const obj: BoxrecGeneralLinks = {
            bio: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const {href, hrefArr} = BoxrecCommonLinks.parseLinksColumn(elem);

            hrefArr.forEach(cls => {
                if (cls !== "primaryIcon" && cls !== "clickableIcon") {
                    const matches: RegExpMatchArray | null = href.match(/(\d+)$/);
                    if (matches && matches[1] && matches[1] !== "other") {

                        let formattedCls: string = cls;
                        // for some reason they add a `P` to the end of the class name, we will remove it
                        if (cls.slice(-1) === "P") {
                            formattedCls = cls.slice(0, -1);
                        }

                        // if it's one of the `bio_closed/bio_open` link, change it to just `bio`
                        formattedCls =
                            formattedCls === "bio_open" || formattedCls === "bio_closed" ? "bio" : formattedCls;

                        (obj as any)[formattedCls] = parseInt(matches[1], 10);
                    } else {
                        (obj as any).other.push(href);
                    }
                }
            });
        });

        return obj;
    }

    protected parseLinks(): Cheerio {
        throw new Error("Needs to be overridden by child class");
    }

}
