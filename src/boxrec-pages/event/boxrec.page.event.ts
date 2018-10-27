import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecBoutLocation} from "../boxrec.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";
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
    }

    get commission(): string | null {
        const commission: string = this.parseEventData("commission");
        if (commission) {
            return commission.trim();
        }

        return null;
    }

    get doctors(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this.parseEventData(BoxrecRole.doctor)}</div>`);
        const doctors: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const doctor: BoxrecBasic = BoxrecCommonTablesColumnsClass.parseNameAndId(this.$.html(elem));
            doctors.push(doctor);
        });

        return doctors;
    }

    get inspectors(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this.parseEventData(BoxrecRole.inspector)}</div>`);
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


        let location: string | null = this.$(this.parseEventResults()).find("thead table > tbody tr:nth-child(2) b").html();

        if (location === null) {
            // todo this is because one is for events, one if for bouts.  It's not the best approach and should be refactored
            const locationClone: Cheerio = this.$(".content h2").parent().clone();
            locationClone.remove("h2");
            locationClone.find("a:nth-child(1)").remove();
            locationClone.find(".titleColor").remove();
            locationClone.find("a:last-child").remove();
            location = locationClone.html();
        }

        if (location !== null) {
            const html: Cheerio = this.$(`<div>${location}</div>`);
            const links: Cheerio = html.find("a");

            locationObject.venue = BoxrecPageEvent.getVenueInformation(links);
            locationObject.location = BoxrecPageEvent.getLocationInformation(links);
        }

        return locationObject;
    }

    get matchmakers(): BoxrecBasic[] {
        const html: Cheerio = this.$(`<div>${this.parseEventData(BoxrecRole.matchmaker)}</div>`);
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
        const html: Cheerio = this.$(`<div>${this.parseEventData(BoxrecRole.promoter)}</div>`);
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
        const television: string = this.parseEventData("television");

        if (television) {
            return television.split(",").map(item => {
                const text: string = this.$(item).text();
                return trimRemoveLineBreaks(text);
            });
        }

        return [];
    }

    get date(): string | null {
        const date: string | null = this.parseDate();

        if (date) {
            return trimRemoveLineBreaks(date);
        }

        return date;
    }

    get id(): number {
        let id: string = "";
        const wikiHref: string | null = this.$(this.parseEventResults()).find("h2").next().find(".bio_closedP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                id = wikiLink[1];
            }
        }

        return parseInt(id, 10);
    }

    // todo can make this and the other one private/protected?
    getPeopleTable(): Cheerio {
        return this.$("table thead table tbody tr");
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

    private parseEventData(role: BoxrecRole | "television" | "commission"): string {
        let results: string | null = "";

        this.getPeopleTable().each((i: number, elem: CheerioElement) => {
            const tag: string = this.$(elem).find("td:nth-child(1)").text().trim();
            const val: Cheerio = this.$(elem).find("td:nth-child(2)");

            if (tag === role) {
                results = val.html();
            } else if (tag === role) {
                // tested if `television` might actually be a BoxRec role but it isn't
                results = val.html();
            }
        });

        return results;
    }

    private parseEventResults(): Cheerio {
        return this.$("table");
    }

}
