import {BoxrecCommonTablesColumnsClass} from "@boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecBasic, BoxrecBoutLocation} from "@boxrec-constants";
import {BoxrecEventOutput} from "@boxrec-pages/event/boxrec.event.constants";
import {trimRemoveLineBreaks} from "@helpers";
import * as cheerio from "cheerio";
import {BoxrecRole} from "../search/boxrec.search.constants";
import {BoxrecEvent} from "./boxrec.event";

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

    get date(): string | null {
        const date: string | null = this.parseDate();

        if (date) {
            return trimRemoveLineBreaks(date);
        }

        return date;
    }

    get doctors(): BoxrecBasic[] {
        return this.$(`<div>${this.parseEventData(BoxrecRole.doctor)}</div>`)
            .find("a")
            .map((i: number, elem: CheerioElement) => this.$.html(elem))
            .get()
            .map(item => BoxrecCommonTablesColumnsClass.parseNameAndId(item));
    }

    get id(): number | null {
        // attempts to parse the link information
        const getLink: (href: string | null) => number | null = (href: string | null): number | null => {
            if (href) {
                const wikiLink: RegExpMatchArray | null = href.match(/(\d+)$/);
                if (wikiLink && wikiLink[1]) {
                    return parseInt(wikiLink[1], 10);
                }
            }

            return null;
        };

        const parent: Cheerio = this.$(this.parseEventResults()).find("h2").next();
        let wikiHref: string | null = parent.find(".bio_closedP").parent().attr("href");
        if (wikiHref) {
            return getLink(wikiHref);
        }

        wikiHref = parent.find(".bio_openP").parent().attr("href");
        return getLink(wikiHref);
    }

    get inspector(): BoxrecBasic {
        const html: Cheerio = this.$(`<div>${this.parseEventData(BoxrecRole.inspector)}</div>`);
        let inspector: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            inspector = BoxrecCommonTablesColumnsClass.parseNameAndId(this.$(elem).text());
        });

        return inspector;
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
        const matchmakers: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: RegExpMatchArray | null = this.$(elem).get(0).attribs.href.match(/(\d+)$/);
            if (href) {
                const name: string = this.$(elem).text();
                const id: number = parseInt(href[i], 10);
                matchmakers.push({
                    id,
                    name,
                });
            }

        });

        return matchmakers;
    }

    protected parsePromoters(): string {
        return this.parseEventData(BoxrecRole.promoter);
    }

    get output(): BoxrecEventOutput {
        return {
            bouts: this.bouts,
            commission: this.commission,
            date: this.date,
            doctors: this.doctors,
            id: this.id,
            inspector: this.inspector,
            location: this.location,
            matchmakers: this.matchmakers,
            numberOfBouts: this.numberOfBouts,
            promoters: this.promoters,
            television: this.television,
        };
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

    private parseDate(): string | null {
        const eventResults: Cheerio = this.parseEventResults();
        const date: string = this.$(eventResults).find("h2").text(); // ex. Saturday 5, May 2018
        // if date hasn't been set, this will be an empty string, leave as null
        if (date) {
            return new Date(date).toISOString().slice(0, 10);
        }

        return null;
    }

    private parseEventResults(): Cheerio {
        return this.$("table");
    }

}
