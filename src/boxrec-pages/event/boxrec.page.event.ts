import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {townRegionCountryRegex, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecBoutLocation} from "../boxrec.constants";
import {BoxrecEvent} from "./boxrec.event";
import {BoxrecPromoter} from "./boxrec.event.constants";

const cheerio: CheerioAPI = require("cheerio");

/**
 * Parse an Event page
 */
export class BoxrecPageEvent extends BoxrecEvent {

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
        this.parseDate();
        this.parseEventData();
    }

    get date(): string | null {
        const date: string | null = this.parseDate();

        if (date) {
            return trimRemoveLineBreaks(date);
        }

        return date;
    }

    get doctors(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this._doctor}</div>`);
        const doctors: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const doctor: BoxrecBasic = BoxrecCommonTablesColumnsClass.parseNameAndId(this.$.html(elem));
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
                id: null,
                region: null,
                town: null,
            },
            venue: {
                id: null,
                name: null,
            },
        };

        const html: Cheerio = this.$(`<div>${this._location}</div>`);
        const links: Cheerio = html.find("a");
        const venueId: RegExpMatchArray | null = links.get(0).attribs.href.match(/(\d+)$/);
        const venueName: string | undefined = links.get(0).children[0].data;

        // if the number of links is 2, the link with all the information changes position // 2 is 0, 3/4 is 1
        const hrefPosition: number = +(links.length === 3 || links.length === 4);

        const locationMatches: RegExpMatchArray | null = links.get(hrefPosition).attribs.href.match(townRegionCountryRegex) as string[];

        if (venueId && venueId[1] && venueName) {
            locationObject.venue.id = parseInt(venueId[1], 10);
            locationObject.venue.name = venueName;
        }

        if (locationMatches) {
            const [, country, region, townId] = locationMatches;

            locationObject.location.id = parseInt(townId, 10);
            locationObject.location.town = links.get(1).children[0].data as string;

            // there are 2-4 links
            // 2-3 usually means `region` is missing, 4 means it has town, region, country and venue
            if (links.length === 4) {
                locationObject.location.region = links.get(2).children[0].data as string;
                locationObject.location.country = links.get(3).children[0].data as string;
            } else if (links.length === 3) {
                locationObject.location.country = links.get(2).children[0].data as string;
            } else if (links.length === 2) {
                locationObject.location.town = links.get(0).children[0].data as string;
                locationObject.location.country = links.get(1).children[0].data as string;
            }
        }

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

    get television(): string[] {
        const television: string = this._television;

        if (television) {
            return television.split(",").map(item => trimRemoveLineBreaks(item));
        }

        return [];
    }

    get id(): number {
        return parseInt(this._id, 10);
    }

    private parseDate(): string | null {
        const eventResults: Cheerio = this.parseEventResults();
        const date: string = this.$(eventResults).find("h2").text(); // ex. Saturday 5, May 2018
        // if date hasn't been set, this will be an empty string, leave as null
        if (date) {
            return new Date(date).toISOString().slice(0, 10);
        }

        return null;
    }

    private parseEventData(): void {
        const eventResults: Cheerio = this.parseEventResults();

        this.$(eventResults).find("thead table tbody tr").each((i: number, elem: CheerioElement) => {
            const tag: string = this.$(elem).find("td:nth-child(1)").text().trim();
            const val: Cheerio = this.$(elem).find("td:nth-child(2)");

            if (tag === "commission") {
                this._commission = val.text();
            } else if (tag === "promoter") {
                this._promoter = val.html();
            } else if (tag === "matchmaker") {
                this._matchmaker = val.html();
            } else if (tag === "television") {
                this._television = val.text();
            } else if (tag === "doctor") {
                this._doctor = val.html();
            } else if (tag === "inspector") {
                this._inspector = val.html();
            }
        });

        const wikiHref: string | null = this.$(eventResults).find("h2").next().find(".bio_closedP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                this._id = wikiLink[1];
            }
        }

        this._location = this.$(eventResults).find("thead table > tbody tr:nth-child(2) b").html();
    }

    private parseEventResults(): Cheerio {
        return this.$("table");
    }

}
