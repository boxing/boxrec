import {BoxrecBasic, BoxrecBoutLocation} from "../boxrec.constants";
import {townRegionCountryRegex, trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";
import {BoxrecPromoter} from "./boxrec.event.constants";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Parse an Event page
 */
export class BoxrecPageEvent {

    private _id: string;
    private _date: string;
    private _location: string | null;
    private _commission: string;
    private _promoter: string | null;
    private _matchmaker: string | null;
    private _doctor: string | null;
    private _inspector: string | null;
    private _television: string;
    private _bouts: [string, string | null][] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseEventData();
        this.parseBouts();
    }

    get id(): number {
        return parseInt(this._id, 10);
    }

    get date(): string {
        return trimRemoveLineBreaks(this._date);
    }

    get commission(): string | null {
        if (this._commission) {
            return this._commission.trim();
        }

        return null;
    }

    get matchmaker(): BoxrecBasic[] {
        const html: Cheerio = $(`<div>${this._matchmaker}</div>`);
        const matchmaker: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: RegExpMatchArray | null = $(elem).get(0).attribs.href.match(/(\d+)$/);
            if (href) {
                const name: string = $(elem).text();
                matchmaker.push({
                    id: parseInt(href[1], 10),
                    name,
                });
            }

        });

        return matchmaker;
    }

    get location(): BoxrecBoutLocation {
        const locationObject: BoxrecBoutLocation = {
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

        const html: Cheerio = $(`<div>${this._location}</div>`);
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

    get doctor(): BoxrecBasic[] {
        const html: Cheerio = $(`<div>${this._doctor}</div>`);
        const doctors: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const doctor: BoxrecBasic = BoxrecCommonTablesClass.parseNameAndId($(elem).text());
            doctors.push(doctor);
        });

        return doctors;
    }

    get inspector(): BoxrecBasic[] {
        const html: Cheerio = $(`<div>${this._inspector}</div>`);
        const inspectors: BoxrecBasic[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const doctor: BoxrecBasic = BoxrecCommonTablesClass.parseNameAndId($(elem).text());
            inspectors.push(doctor);
        });

        return inspectors;
    }

    get promoter(): BoxrecPromoter[] {
        const html: Cheerio = $(`<div>${this._promoter}</div>`);
        const promoter: BoxrecPromoter[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const name: string = $(elem).text();
            let id: number | null = null;
            let company: string | null = null;

            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);

            if (matches) {
                id = parseInt(matches[0], 10);
            }

            const htmlString: string | null = html.html();

            if (htmlString) {
                // this regex may not work for everything
                const regex: RegExp = /([\w\d\-\s]+)\s-\s<a\shref/g;

                let m: RegExpExecArray | null;
                let j: number = 0;
                do {
                    m = regex.exec(htmlString);
                    if (m && m[1]) {
                        if (j === promoter.length) {
                            company = m[1].trim();
                        }
                    }
                    j++;
                } while (m);

                if (company) {
                    promoter.push({
                        id,
                        company,
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

    get bouts(): BoxrecPageEventBoutRow[] {
        const bouts: [string, string | null][] = [] = this._bouts;
        const boutsList: BoxrecPageEventBoutRow[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecPageEventBoutRow = new BoxrecPageEventBoutRow(val[0], val[1]);
            boutsList.push(bout);
        });

        return boutsList;
    }

    private parseEventData(): void {
        this._date = $("h2:nth-child(2)").text();

        const eventResults: Cheerio = $("table#eventResults");

        $(eventResults).find("thead table tbody tr").each((i: number, elem: CheerioElement) => {
            const tag: string = $(elem).find("td:nth-child(1)").text().trim();
            const val: Cheerio = $(elem).find("td:nth-child(2)");

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

        const date: string = $(eventResults).find("h2").text(); // ex. Saturday 5, May 2018
        // if date hasn't been set, this will be an empty string, leave as null
        if (date) {
            this._date = new Date(date).toISOString().slice(0, 10);
        }

        const wikiHref: string | null = $(eventResults).find("h2").next().find(".bio_closedP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                this._id = wikiLink[1];
            }
        }

        this._location = $(eventResults).find("thead table > tbody tr:nth-child(2) b").html();
    }

    private parseBouts(): void {
        const tr: Cheerio = $("table#eventResults > tbody tr");
        tr.each((i: number, elem: CheerioElement) => {
            const boutId: string = $(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (!boutId || boutId.includes("second")) {
                return;
            }

            // we need to check to see if the next row is associated with this bout
            let isNextRowAssociated: boolean = false;
            let nextRow: Cheerio | null = $(elem).next();
            let nextRowId: string = nextRow.attr("id");

            if (nextRowId) {
                nextRowId = nextRowId.replace(/[a-zA-Z]/g, "");

                isNextRowAssociated = nextRowId === boutId;
                if (!isNextRowAssociated) {
                    nextRow = null;
                }
            } // else if no next bout exists

            const html: string = $(elem).html() || "";
            const next: string | null = nextRow ? nextRow.html() : null;
            this._bouts.push([html, next]);
        });
    }

}
