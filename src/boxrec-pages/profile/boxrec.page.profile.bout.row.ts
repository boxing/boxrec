import {BoxrecBout, BoxrecBoutLocation} from "../boxrec.constants";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";

const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageProfileBout extends BoxrecCommonTablesClass {

    private _date: string;
    private _links: string;
    private _location: string;

    constructor(boxrecBodyBout: string, additionalData: string | null = null) {
        super();
        const html: string = `<table><tr>${boxrecBodyBout}</tr><tr>${additionalData}</tr></table>`;
        $ = cheerio.load(html);

        this.parseBout();
        this.parseMetadata();
    }

    get get(): BoxrecBout {
        return {
            date: this.date,
            firstBoxerWeight: this.firstBoxerWeight,
            secondBoxer: this.secondBoxer,
            secondBoxerWeight: this.secondBoxerWeight,
            secondBoxerRecord: this.secondBoxerRecord,
            secondBoxerLast6: this.secondBoxerLast6,
            titles: this.titles,
            referee: this.referee,
            judges: this.judges,
            rating: this.rating,
            result: this.result,
            location: this.location,
            links: this.links,
            metadata: this.metadata,
        };
    }

    get date() {
        const date = this._date;
        return date.trim();
    }

    get location(): BoxrecBoutLocation {
        // instead of returning undefined, I'm sure there will be records where pieces of this information are missing or different
        const location: BoxrecBoutLocation = {
            location: {
                town: null,
                id: null,
                region: null,
                country: null,
            },
            venue: {
                id: null,
                name: null,
            },
        };

        const regex: RegExp = /(\d+)$/;

        const html = $(`<div>${this._location}</div>`);

        const venueLink: CheerioElement = html.find("a").get(0);
        const areaLink: CheerioElement = html.find("a").get(1);

        if (venueLink) {
            // venue name
            if (venueLink.children[0]) {
                const venueLinkData: string | undefined = venueLink.children[0].data;
                if (venueLinkData) {
                    location.venue.name = venueLinkData.trim();
                }
            }

            // venue id
            const venueIdMatches = venueLink.attribs.href.match(regex);
            if (venueIdMatches && venueIdMatches[1]) {
                location.venue.id = parseInt(venueIdMatches[1], 10);
            }
        }

        if (areaLink) {
            // todo make this able to be parsed by parent class

            // city
            const areaLinkData: string | undefined = areaLink.children[0].data;
            if (areaLinkData && areaLinkData.trim().length) {
                location.location.town = trimRemoveLineBreaks(areaLinkData);
            }

            // the following regex assumes the query string is always in the same format
            const areaRegex: RegExp = /\?country=([A-Za-z]+)&region=([A-Za-z]+)&town=(\d+)/;
            const matches = areaLink.attribs.href.match(areaRegex) as string[];

            if (matches) {
                const [, country, region, townId] = matches;
                location.location.country = country;
                location.location.region = region;
                location.location.id = parseInt(townId, 10);
            }
        }

        return location;
    }

    // returns an object with keys that contain a class other than `clickableIcon`
    get links(): any { // object of strings
        const html = $(this._links);
        const obj = {
            other: [], // any other links we'll throw the whole href attribute in here
        };

        html.find(".mobileActions a").each((i: number, elem: CheerioElement) => {
            const div: Cheerio = $(elem).find("div");
            const href: string = $(elem).attr("href");
            const classAttr: string = div.attr("class");
            const hrefArr: string[] = classAttr.split(" ");

            hrefArr.forEach(cls => {
                if (cls !== "clickableIcon") {
                    const matches = href.match(/(\d+)$/);
                    if (matches && matches[1] && matches[1] !== "other") {
                        (obj as any)[cls] = parseInt(matches[1], 10);
                    } else {
                        (obj as any).other.push(href);
                    }
                }
            });
        });

        return obj;
    }

    private parseBout(): void {
        const getColumnData = (nthChild: number, returnHTML: boolean = true): string => {
            const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

            if (returnHTML) {
                return el.html() || "";
            }

            return el.text();
        };

        this._date = getColumnData(2, false);
        this._firstBoxerWeight = getColumnData(3, false);
        // empty 4th column
        this._secondBoxer = getColumnData(5);
        this._secondBoxerWeight = getColumnData(6, false);
        this._secondBoxerRecord = getColumnData(7);
        this._secondBoxerLast6 = getColumnData(8);
        this._location = getColumnData(9);
        this._outcome = getColumnData(10, false);
        this._outcomeByWayOf = getColumnData(11);
        this._numberOfRounds = getColumnData(12, false);
        this._rating = getColumnData(13);
        this._links = getColumnData(14);
    }

    private parseMetadata(): void {
        const el: Cheerio = $(`tr:nth-child(2) td:nth-child(1)`);
        this._metadata = el.html() || "";
    }

}
