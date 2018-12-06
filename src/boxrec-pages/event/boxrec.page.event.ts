import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecBoutLocation} from "../boxrec.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";
import {BoxrecEvent} from "./boxrec.event";

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

    get date(): string | null {
        const date: string | null = this.parseDate();

        if (date) {
            return trimRemoveLineBreaks(date);
        }

        return date;
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
