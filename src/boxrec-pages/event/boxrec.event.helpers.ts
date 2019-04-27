import * as querystring from "querystring";
import {ParsedUrlQuery} from "querystring";
import {BoxrecBoutLocation, BoxrecLocation} from "../boxrec.constants";

export const emptyLocationObject: BoxrecBoutLocation = {
    location: {
        country: {
            id: null,
            name: null,
        },
        region: {
            id: null,
            name: null,
        },
        town: {
            id: null,
            name: null,
        },
    },
    venue: {
        id: null,
        name: null,
    },
};

export const getLocationValue: (href: string, type: "town" | "region" | "country") => string | number | null =
    (href: string, type: "town" | "region" | "country"): string | number | null => {
        const matches: RegExpMatchArray | null = href.match(/(\w+)\=(\w+)/g);
        if (matches) {
            for (const match of matches) {
                const splitQuery: ParsedUrlQuery = querystring.parse(match);
                const keys: string[] = Object.keys(splitQuery);

                if (keys[0] === type) {
                    return splitQuery[keys[0]] as any;
                }
            }
        }

        return null;
    };

/**
 * By passing in links and a location object, it will parse it and find the correct values and return the object
 * @param links         is the Cheerio object of the DOM
 * @param locationObj   is an object that will be returned with the updated values
 * @param type          whether we want set the town, region, or country
 * @param linkNumber    if there are multiple links, we need to specify which number the data is in
 */
export const setValueInLocationObject: (links: Cheerio, locationObj: BoxrecLocation, type: "town" | "region" | "country", linkNumber: number) => BoxrecLocation
    = (links: Cheerio, locationObj: BoxrecLocation, type: "town" | "region" | "country", linkNumber: number): BoxrecLocation => {
    locationObj[type] = {
        id: getLocationValue(links.get(linkNumber).attribs.href, type),
        name: links.get(linkNumber).children[0].data as string,
    };
    return locationObj;
};
