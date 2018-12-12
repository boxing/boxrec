import * as cheerio from "cheerio";
import {BoxrecProfileLinks} from "./boxrec.profile.constants";

// contains common functionality of profiles rows
export abstract class BoxrecProfileCommonRow {

    protected readonly $: CheerioStatic;

    constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    get links(): BoxrecProfileLinks {
        const html: Cheerio = this.parseLinks();
        const obj: BoxrecProfileLinks = {
            bio_open: null,
            bout: null,
            event: null,
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = this.$(elem).find("div");
            const href: string = this.$(elem).attr("href");
            const classAttr: string = div.attr("class");
            const hrefArr: string[] = classAttr.split(" ");

            hrefArr.forEach(cls => {
                if (cls !== "primaryIcon" && cls !== "clickableIcon") {
                    const matches: RegExpMatchArray | null = href.match(/(\d+)$/);
                    if (matches && matches[1] && matches[1] !== "other") {

                        let formattedCls: string = cls;
                        // for some reason they add a `P` to the end of the class name, we will remove it
                        if (cls.slice(-1) === "P") {
                            formattedCls = cls.slice(0, -1);
                        }

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
