import * as cheerio from "cheerio";

const $: CheerioStatic = cheerio;

interface LinksObj {
    classAttr: string;
    div: Cheerio;
    href: string;
    hrefArr: string[];
}

export class BoxrecCommonLinks {

    /**
     * Takes a link column and returns the needed data to parse it
     * @param {CheerioElement} elem
     * @returns {LinksObj}
     */
    static parseLinkInformation(elem: CheerioElement): LinksObj {
        const div: Cheerio = $(elem).find("div");
        const href: string = $(elem).attr("href");
        const classAttr: string = div.attr("class");
        const hrefArr: string[] = classAttr.split(" ");

        return {
            classAttr,
            div,
            href,
            hrefArr,
        };
    }

    static parseLinks<T>(hrefArr: string[], href: string, obj: T): T {
        hrefArr.forEach((cls: string) => {
            if (cls !== "primaryIcon" && cls !== "clickableIcon") {
                const matches: RegExpMatchArray | null = href.match(/([\d\/]+)$/);
                if (matches && matches[1] && matches[1] !== "other") {

                    let formattedCls: string = cls;
                    // for some reason they add a `P` to the end of the class name, we will remove it
                    if (cls.slice(-1) === "P") {
                        formattedCls = cls.slice(0, -1);
                    }

                    // check if it contains "/" but is not the first character
                    if (matches[1].includes("/")) {
                        const formattedMatch: string = matches[1].substring(1);
                        const numberOfSlashes: RegExpMatchArray | null = matches[1].match(/(\/)/g);

                        // if there are more than 1 slash, it's a string otherwise we've stripped it off and can make it a number
                        (obj as any)[formattedCls] = numberOfSlashes && numberOfSlashes.length > 1 ? formattedMatch : parseInt(formattedMatch, 10);
                    } else {
                        (obj as any)[formattedCls] = parseInt(matches[1], 10);
                    }

                } else {
                    (obj as any).other.push(href);
                }
            }
        });

        return obj;
    }

}
