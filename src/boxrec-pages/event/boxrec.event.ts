import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {townRegionCountryRegex, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecBoutLocation, Location} from "../boxrec.constants";
import {BoxrecPromoter} from "./boxrec.event.constants";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Used specifically for Events page and Dates page
 */
export abstract class BoxrecEvent {

    protected $: CheerioStatic;
    protected _bouts: Array<[string, string | null]> = [];
    protected _commission: string;
    protected _doctor: string | null;
    protected _id: string;
    protected _inspector: string | null;
    protected _location: string | null;
    protected _matchmaker: string | null;
    protected _promoter: string | null;
    protected _television: string;

    protected constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get bouts(): BoxrecPageEventBoutRow[] {
        const bouts: Array<[string, string | null]> = [] = this.parseBouts();
        const boutsList: BoxrecPageEventBoutRow[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecPageEventBoutRow = new BoxrecPageEventBoutRow(val[0], val[1], true); // todo this can't be hardcoded here, wrecks dates
            boutsList.push(bout);
        });

        return boutsList;
    }

    get commission(): string | null {
        if (this._commission) {
            return this._commission.trim();
        }

        return null;
    }

    get doctors(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this._doctor}</div>`);
        const doctors: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const doctor: BoxrecBasic = BoxrecCommonTablesColumnsClass.parseNameAndId($.html(elem));
            doctors.push(doctor);
        });

        return doctors;
    }

    get inspectors(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this._inspector}</div>`);
        const inspectors: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const inspector: BoxrecBasic = BoxrecCommonTablesColumnsClass.parseNameAndId(this.$(elem).text());
            inspectors.push(inspector);
        });

        return inspectors;
    }

    get location(): BoxrecBoutLocation {
        const locationObject: BoxrecBoutLocation = {
            location: {
                country: null,
                id: null, // can be missing
                region: null,
                town: null, // can be missing
            },
            venue: {
                id: null,
                name: null,
            },
        };

        const html: Cheerio = this.$(`<div>${this._location}</div>`);
        const links: Cheerio = html.find("a");

        locationObject.venue = BoxrecEvent.getVenueInformation(links);
        locationObject.location = BoxrecEvent.getLocationInformation(links);
        return locationObject;
    }

    get matchmakers(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this._matchmaker}</div>`);
        const matchmaker: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: RegExpMatchArray | null = this.$(elem).get(0).attribs.href.match(/(\d+)$/);
            if (href) {
                const name: string = this.$(elem).text();
                matchmaker.push({
                    id: parseInt(href[1], 10),
                    name,
                });
            }

        });

        return matchmaker;
    }

    get promoters(): BoxrecPromoter[] {
        const html: Cheerio = this.$(`<div>${this._promoter}</div>`);
        const promoter: BoxrecPromoter[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: string = this.$(elem).get(0).attribs.href;
            const name: string = this.$(elem).text();
            let id: number | null = null;
            let company: string | null = null;

            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);

            if (matches) {
                id = parseInt(matches[0], 10);
            }

            const htmlString: string | null = html.html();

            if (htmlString) {
                // this regex may not work for everything (this comment was about `event` pages)
                // turns out `events` page and `bout` page display promoters differently
                // ex. of links between `event` pages and `bout` pages
                // events - `Golden Boy Promotions - Oscar De La Hoya`
                // bouts  - `Oscar De La Hoya (Golden Boy Promotions)`

                // first we'll figure out which one we're looking at, then choose the proper regex to use
                // we should also assume that both might fail

                // these both share the same characters for company names
                // capture forward slashes in it because `360/GGG/K2 Promotions`
                const promoterEventsPageRegex: RegExp = /([\w\d\/\-\s]+)\s-\s<a\shref/g;
                const promoterBoutsPageRegex: RegExp = /\(([\w\d\/\-\s]+)\)/g;

                const eventsRegexReturnsResults: RegExpMatchArray | null = promoterEventsPageRegex.exec(htmlString);

                let regexThatGetsResults: RegExp;

                if (eventsRegexReturnsResults !== null) {
                    regexThatGetsResults = promoterEventsPageRegex;
                } else {
                    const boutsRegexReturnsResults: RegExpMatchArray | null = promoterBoutsPageRegex.exec(htmlString);

                    if (boutsRegexReturnsResults !== null) {
                        regexThatGetsResults = promoterBoutsPageRegex;
                    } else {
                        // both regex did not work, either broken or they don't exist
                        return promoter;
                    }
                }

                regexThatGetsResults.lastIndex = 0; // reset the index of the `RegExp` // requires `g` flag on regex

                let m: RegExpExecArray | null;
                let j: number = 0;

                do {
                    m = regexThatGetsResults.exec(htmlString);
                    if (m && m[1]) {
                        if (j === promoter.length) {
                            company = m[1].trim();
                        }
                    }
                    j++;
                } while (m);

                if (company) {
                    promoter.push({
                        company,
                        id,
                        name,
                    });
                }
            }

        });

        return promoter;
    }

    get television(): string[] | null {
        const television: string = this._television;

        if (television) {
            return television.split(",").map(item => trimRemoveLineBreaks(item));
        }

        return null;
    }

    protected static getLocationInformation(links: Cheerio): Location {
        // if the number of links is 2, the link with all the information changes position // 2 is 0, 3/4 is 1
        const hrefPosition: number = +(links.length === 3 || links.length === 4);

        const locationObject: Location = {
            country: null,
            id: null,
            region: null,
            town: null,
        };

        const locationMatches: RegExpMatchArray | null = links.get(hrefPosition).attribs.href.match(townRegionCountryRegex) as string[];

        if (locationMatches) {
            const [, country, region, townId] = locationMatches;

            if (townId) {
                locationObject.id = parseInt(townId, 10);
                locationObject.town = links.get(1).children[0].data as string;
            }

            // there are 1-4 links
            // 2-3 usually means `region` is missing, 4 means it has town, region, country and venue
            // 1 is only country
            if (links.length === 4) {
                locationObject.region = links.get(2).children[0].data as string;
                locationObject.country = links.get(3).children[0].data as string;
            } else if (links.length === 3) {
                locationObject.country = links.get(2).children[0].data as string;
            } else if (links.length === 2) {
                locationObject.town = links.get(0).children[0].data as string;
                locationObject.country = links.get(1).children[0].data as string;
            } else if (links.length === 1) {
                locationObject.country = links.get(0).children[0].data as string;
            }
        }

        return locationObject;
    }

    protected static getVenueInformation(links: Cheerio): BoxrecBasic {
        const obj: BoxrecBasic = {
            id: null,
            name: null,
        };

        // if the number of links is 1, it's presumably missing the venue
        // we wouldn't know the venue and know the location
        if (links.length > 1) {
            const venueId: RegExpMatchArray | null = links.get(0).attribs.href.match(/(\d+)$/);
            const venueName: string | undefined = links.get(0).children[0].data;

            if (venueId && venueId[1] && venueName) {
                obj.id = parseInt(venueId[1], 10);
                obj.name = venueName;
            }
        }

        return obj;
    }

    private parseBouts(): Array<[string, string | null]> {
        const tr: Cheerio = this.$("table > tbody tr");
        const bouts: Array<[string, string | null]> = [];

        tr.each((i: number, elem: CheerioElement) => {
            const boutId: string = this.$(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (!boutId || boutId.includes("second")) {
                return;
            }

            // we need to check to see if the next row is associated with this bout
            let isNextRowAssociated: boolean = false;
            let nextRow: Cheerio | null = this.$(elem).next();
            let nextRowId: string = nextRow.attr("id");

            if (nextRowId) {
                nextRowId = nextRowId.replace(/[a-zA-Z]/g, "");

                isNextRowAssociated = nextRowId === boutId;
                if (!isNextRowAssociated) {
                    nextRow = null;
                }
            } // else if no next bout exists

            const html: string = this.$(elem).html() || "";
            const next: string | null = nextRow ? nextRow.html() : null;
            bouts.push([html, next]);
        });

        return bouts;
    }

}
