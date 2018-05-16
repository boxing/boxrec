import {BoxrecBasic, BoxrecBoutLocation, BoxrecEventBout, BoxrecPromoter} from "../boxrec.constants";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

const cheerio = require("cheerio");
let $: CheerioAPI;

/**
 * Parse an Event page
 */
export class BoxrecPageEvent {

    private _date: string;
    private _location: string | null;
    private _commission: string;
    private _promoter: string | null;
    private _matchmaker: string | null;
    private _television: string;
    private _metadata: string;
    private _bouts: [string, string | null][] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseEventData();
        this.parseBouts();
    }

    get date(): string {
        return this.metadata.startDate;
    }

    get commission(): string | null {
        if (this._commission) {
            return this._commission.trim();
        }

        return null;
    }

    get metadata() {
        if (this._metadata) {
            return JSON.parse(this._metadata)[0];
        }

        return {};
    }

    get matchmaker(): BoxrecBasic[] {
        const html = $(`<div>${this._matchmaker}</div>`);
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

        const metadata = this.metadata;

        if (metadata.location && metadata.location.address) {
            const {streetAddress: venueName, addressLocality: town, addressRegion: region, addressCountry: country} = metadata.location.address;

            location.venue.name = venueName;
            location.location.town = town;
            location.location.region = region;
            location.location.country = country;

            const regex: RegExp = /(\d+)$/;
            const html = $(`<div>${this._location}</div>`);

            const venueLink: CheerioElement = html.find("a").get(3);
            const areaLink: CheerioElement = html.find("a").get(4);

            if (venueLink) {
                // venue id
                const venueIdMatches = venueLink.attribs.href.match(regex);
                if (venueIdMatches && venueIdMatches[1]) {
                    location.venue.id = parseInt(venueIdMatches[1], 10);
                }
            }

            if (areaLink) {
                // the following regex assumes the query string is always in the same format
                const areaRegex: RegExp = /\?country=([A-Za-z]+)&region=([A-Za-z]+)&town=(\d+)/;
                const matches = areaLink.attribs.href.match(areaRegex) as string[];

                if (matches) {
                    const [, , , townId] = matches;
                    location.location.id = parseInt(townId, 10);
                }
            }
        }

        return location;
    }

    get promoter(): BoxrecPromoter[] {
        const html = $(`<div>${this._promoter}</div>`);
        const promoter: BoxrecPromoter[] = [];

        html.find("a").each((i: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const name: string = $(elem).text();
            let id: number | null = null;
            let company: string | null = null;

            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);

            if (matches && matches[0]) {
                id = parseInt(matches[0], 10);
            }

            const htmlString = html.html();

            if (htmlString) {
                // this regex may not work for everything
                const regex = /([\w\d\-\s]+)\s\-\s\<a\shref/g;

                let m;
                let j = 0;
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

    get bouts(): BoxrecEventBout[] {
        const bouts = this._bouts;
        let boutsList: BoxrecEventBout[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecEventBout = new BoxrecPageEventBoutRow(val[0], val[1]);
            boutsList.push(bout);
        });

        return boutsList;
    }

    private parseEventData() {
        this._date = $("h2:nth-child(2)").text();

        $("#eventResults thead table tbody tr").each((i: number, elem: CheerioElement) => {
            const tag: string = $(elem).find("td:nth-child(1)").text().trim();
            const val = $(elem).find("td:nth-child(2)");

            if (tag === "commission") {
                this._commission = val.text();
            } else if (tag === "promoter") {
                this._promoter = val.html();
            } else if (tag === "matchmaker") {
                this._matchmaker = val.html();
            } else if (tag === "television") {
                this._television = val.text();
            }
        });

        this._metadata = $("script[type='application/ld+json']").html() || "";
        this._location = $("#eventResults thead table").html();
    }

    private parseBouts() {
        const tr = $("table#eventResults > tbody tr");
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

            const html = $(elem).html() || "";
            const next = nextRow ? nextRow.html() : null;
            this._bouts.push([html, next]);
        });
    }

}
