import {
    BoxingBoutOutcome,
    BoxrecBasic,
    BoxrecBout,
    BoxrecBoutLocation,
    BoxrecJudge,
    BoxrecId,
    Record,
    WinLossDraw
} from "../boxrec.constants";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecCommonTablesClass} from "../boxrec-common-tables/boxrec-common-tables.class";

const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageProfileBout extends BoxrecCommonTablesClass {

    private _date: string;
    private _firstBoxerWeight: string;
    private _opponent: string;
    private _secondBoxerWeight: string;
    private _opponentRecord: string;
    private _opponentLast6: string;
    private _outcome: string;
    private _outcomeByWayOf: string;
    private _rating: string;
    private _links: string;
    private _location: string;
    private _numberOfRounds: string;
    private _metadata: string;

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
            secondBoxerWeight: this.secondBoxerWeight,
            opponent: this.opponent,
            opponentRecord: this.opponentRecord,
            opponentLast6: this.opponentLast6,
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

    get firstBoxerWeight(): number | null {
        return super.parseWeight(this._firstBoxerWeight);
    }

    get opponent(): BoxrecBasic {
        const html = $(`<div>${this._opponent}</div>`);
        const href: string = html.find("a").attr("href");
        let opponent: BoxrecBasic = {
            id: null,
            name: null,
        };
        const regex: RegExp = /(\d+)$/;

        if (href) {
            const matches: RegExpMatchArray | null = href.match(regex);

            if (matches && matches[1]) {
                opponent = {
                    id: parseInt(matches[1], 10),
                    name: html.find("a").text(),
                };
            }
        }

        return opponent;
    }

    get referee(): BoxrecBasic {
        const html = $(`<div>${this._metadata}</div>`);
        let referee: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/referee\/(\d+)$/);

            if (matches && matches[1]) {
                const id: number = parseInt(matches[1], 10);
                let name: string = $(elem).text();
                name = trimRemoveLineBreaks(name);

                referee.id = id;
                referee.name = name;
            }
        });

        return referee;
    }

    get judges(): BoxrecJudge[] {
        const html = $(`<div>${this._metadata}</div>`);
        let judges: BoxrecJudge[] = [];

        html.find("a").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/judge\/(\d+)$/);

            if (matches && matches[1]) {
                const id: number = parseInt(matches[1], 10);
                let name: string = $(elem).text();
                name = trimRemoveLineBreaks(name);

                const scoreCardRegex = /<\/a>\s(\d{1,3})-(\d{1,3})/g;
                let scorecard: number[] = [];

                let m;
                let i = 0;
                do {
                    m = scoreCardRegex.exec(this._metadata);
                    if (m && m[1] && m[2]) {
                        if (i === judges.length) {
                            scorecard.push(parseInt(m[1], 10), parseInt(m[2], 10));
                        }
                    }
                    i++;
                } while (m);

                judges.push({
                    id, name, scorecard,
                });
            }
        });

        return judges;
    }

    get titles(): BoxrecId[] {
        let titles: BoxrecId[] = [];
        const html = $(`<div>${this._metadata}</div>`);
        html.find("a.titleLink").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/(\d+\/\w+)$/);

            if (matches && matches[1]) {
                const id: string = matches[1];
                let name: string = $(elem).text();
                name = trimRemoveLineBreaks(name);

                titles.push({
                    id, name,
                });
            }
        });

        return titles;
    }

    // maybe there's additional things that people would want to sift through
    get metadata() {
        return this._metadata;
    }

    get numberOfRounds(): (number | null)[] {
        let numberOfRounds: (number | null)[] = [null, null];

        const splitRounds: string[] = this._numberOfRounds.trim().split("/");
        const formattedSplitRounds: number[] = splitRounds.map(item => parseInt(item, 10));
        if (formattedSplitRounds.length === 2) {
            numberOfRounds = formattedSplitRounds;
        } else if (formattedSplitRounds.length === 1 && !isNaN(formattedSplitRounds[0])) {
            numberOfRounds = [null, formattedSplitRounds[0]];
        }

        return numberOfRounds;
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

    get secondBoxerWeight(): number | null {
        return super.parseWeight(this._secondBoxerWeight);
    }

    get opponentRecord(): Record {
        return super.parseRecord(this._opponentRecord);
    }

    get opponentLast6(): WinLossDraw[] {
        return super.parseLast6Column(this._opponentLast6);
    }

    get result(): [WinLossDraw, BoxingBoutOutcome | string, BoxingBoutOutcome | string] {
        return [this.outcome, this.outcomeByWayOf(), this.outcomeByWayOf(true)];
    }

    get rating(): number | null {
        return super.parseRating(this._rating);
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

    get outcome(): WinLossDraw {
        let outcome: string = this._outcome;
        outcome = outcome.trim();
        let formattedOutcome: WinLossDraw;

        switch (outcome) {
            case "W":
                formattedOutcome = WinLossDraw.win;
                break;
            case "D":
                formattedOutcome = WinLossDraw.draw;
                break;
            case "L":
                formattedOutcome = WinLossDraw.loss;
                break;
            case "S":
                formattedOutcome = WinLossDraw.scheduled;
                break;
            default:
                formattedOutcome = WinLossDraw.unknown;
        }

        return formattedOutcome;
    }

    private outcomeByWayOf(parseText = false): BoxingBoutOutcome | string {
        const html = $(`<div>${this._outcomeByWayOf}</div>`);
        html.find("div").remove();
        let outcomeByWayOf: string = html.text();
        outcomeByWayOf = outcomeByWayOf.trim();

        if (parseText) {
            return BoxingBoutOutcome[outcomeByWayOf as any];
        }

        return outcomeByWayOf;
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
        this._opponent = getColumnData(5);
        this._secondBoxerWeight = getColumnData(6, false);
        this._opponentRecord = getColumnData(7);
        this._opponentLast6 = getColumnData(8);
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
