import {Location, Record, WinLossDraw} from "../boxrec.constants";
import {convertFractionsToNumber, trimRemoveLineBreaks} from "../../helpers";

const cheerio = require("cheerio");
let $: CheerioAPI;

export abstract class BoxrecCommonTablesClass {

    constructor() {
        $ = cheerio.load("<div></div>");
    }

    parseLast6Column(htmlString: string): WinLossDraw[] {
        const last6: WinLossDraw[] = [];
        const opponentLast6: Cheerio = $(htmlString);

        opponentLast6.find("div.last6").each((i: number, elem: CheerioElement) => {
            const className: string = elem.attribs.class;
            if (className.includes("bgW")) {
                last6.push(WinLossDraw.win);
            } else if (className.includes("bgD")) {
                last6.push(WinLossDraw.draw);
            } else if (className.includes("bgL")) {
                last6.push(WinLossDraw.loss);
            } else {
                last6.push(WinLossDraw.unknown);
            }
        });

        return last6;
    }

    parseRecord(htmlString: string): Record {
        const record = {
            draw: -1,
            loss: -1,
            win: -1,
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);

        record.win = parseInt(html.find(".textWon").text(), 10);
        record.loss = parseInt(html.find(".textLost").text(), 10);
        record.draw = parseInt(html.find(".textDraw").text(), 10);

        return record;
    }

    parseRating(htmlString: string): number | null {
        const html = $(htmlString);
        let rating: number | null = null;
        const starRating: Cheerio = html.find(".starRating");

        if (starRating && starRating.get(0)) {
            const widthString: string = html.find(".starRating").get(0).attribs.style;

            if (widthString) {
                const regex = /width:\s(\d+)%;/;
                const widthMatch = widthString.match(regex);

                if (widthMatch && widthMatch[1]) {
                    rating = parseInt(widthMatch[1], 10);
                }
            }
        }

        return rating;
    }

    parseLocationLink(htmlString: string): Location {
        let location: Location = {
            id: null,
            town: null,
            region: null,
            country: null,
        };
        const html = $(`<div>${htmlString}</div>`);
        const links = html.find("a");

        // the following regex assumes the query string is always in the same format
        const areaRegex: RegExp = /\?country=([A-Za-z]+)&region=([A-Za-z]*)&town=(\d+)/;

        if (links.get(0)) {
            const matches = links.get(0).attribs.href.match(areaRegex) as string[];

            if (matches) {
                const [, country, region, townId] = matches;

                if (links) {
                    const data: CheerioElement = links.get(0);
                    if (data) {
                        const town: string | undefined = data.children[0].data;
                        if (town) {
                            location.town = trimRemoveLineBreaks(town);
                            location.country = country;
                            location.region = region;
                            location.id = parseInt(townId, 10);
                        }
                    }
                }
            }
        }

        return location;
    }

    protected parseWeight(str: string): number | null {
        const weight: string = str.trim();
        let formattedWeight: number | null = null;

        if (weight.length) {
            formattedWeight = parseInt(weight, 10);

            if (isNaN(parseInt(weight.slice(-1), 10))) {
                formattedWeight += convertFractionsToNumber(weight.slice(-1));
            }
        }

        return formattedWeight;
    }

}