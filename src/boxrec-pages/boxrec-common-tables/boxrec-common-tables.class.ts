import {BoxrecBasic, BoxrecId, BoxrecJudge, Location, Record, WinLossDraw} from "../boxrec.constants";
import {convertFractionsToNumber, trimRemoveLineBreaks} from "../../helpers";
import {BoxingBoutOutcome} from "../event/boxrec.event.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

/**
 * Parses common table columns found on BoxRec pages
 */
export abstract class BoxrecCommonTablesClass {

    protected _metadata: string;
    protected _numberOfRounds: string;
    protected _rating: string;
    protected _firstBoxerWeight: string = "";
    protected _secondBoxerWeight: string;
    protected _secondBoxerRecord: string;
    protected _secondBoxer: string;
    protected _secondBoxerLast6: string;
    protected _outcome: string = "";
    protected _outcomeByWayOf: string = "";

    protected constructor() {
        $ = cheerio.load("<div></div>");
    }

    static parseAlias(htmlString: string): string | null {
        if (htmlString) {
            return trimRemoveLineBreaks(htmlString);
        }

        return null;
    }

    parseLast6Column(htmlString: string): WinLossDraw[] {
        const last6: WinLossDraw[] = [];
        const opponentLast6: Cheerio = $(htmlString);

        opponentLast6.find("div.last6").each((i: number, elem: CheerioElement) => {
            const className: string = elem.attribs.class;
            if (className.includes("bgW")) {
                last6.push(WinLossDraw.win);
            } else if (className.includes("bgD")) {
                last6.push(WinLossDraw.draw);
            } else if (className.includes("bgL")) {
                last6.push(WinLossDraw.loss);
            } else {
                last6.push(WinLossDraw.unknown);
            }
        });

        return last6;
    }

    get firstBoxerWeight(): number | null {
        return this.parseWeight(this._firstBoxerWeight);
    }

    get secondBoxer(): BoxrecBasic {
        return this.parseNameAndId(this._secondBoxer);
    }

    get secondBoxerWeight(): number | null {
        return this.parseWeight(this._secondBoxerWeight);
    }

    get secondBoxerRecord(): Record {
        let record: Record = {
            win: null,
            loss: null,
            draw: null,
        };

        if (this._secondBoxerRecord) {
            return this.parseRecord(this._secondBoxerRecord);
        }

        return record;
    }

    get secondBoxerLast6(): WinLossDraw[] {
        return this.parseLast6Column(this._secondBoxerLast6);
    }

    parseNameAndId(htmlString: string): BoxrecBasic {
        if (trimRemoveLineBreaks(htmlString) !== "TBA") {
            const html: Cheerio = $(`<div>${htmlString}</div>`);
            const href: string = html.find("a").attr("href");
            const regex: RegExp = /(\d+)$/;

            if (href) {
                const matches: RegExpMatchArray | null = href.match(regex);

                if (matches && matches[1]) {
                    return {
                        id: parseInt(matches[1], 10),
                        name: html.find("a").text(),
                    };
                }
            }
        }

        return {
            id: null,
            name: null,
        };
    }

    parseRecord(htmlString: string): Record {
        const record: Record = {
            draw: null,
            loss: null,
            win: null,
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);

        if (html.find(".textWon") && !htmlString.includes("debut")) { // has fought/or fighter picked
            record.win = parseInt(html.find(".textWon").text(), 10);
            record.loss = parseInt(html.find(".textLost").text(), 10);
            record.draw = parseInt(html.find(".textDraw").text(), 10);
        } else if (htmlString.includes("debut")) {
            record.win = 0;
            record.loss = 0;
            record.draw = 0;
        }

        return record;
    }

    get rating(): number | null {
        return this.parseRating(this._rating);
    }

    parseRating(htmlString: string): number | null {
        const html: Cheerio = $(htmlString);
        let rating: number | null = null;
        const starRating: Cheerio = html.find(".starRating");

        if (starRating && starRating.get(0)) {
            const widthString: string = html.find(".starRating").get(0).attribs.style;

            if (widthString) {
                const regex: RegExp = /width:\s(\d+)%;/;
                const widthMatch: RegExpMatchArray | null = widthString.match(regex);

                if (widthMatch && widthMatch[1]) {
                    rating = parseInt(widthMatch[1], 10);
                }
            }
        }

        return rating;
    }

    get judges(): BoxrecJudge[] {
        return this.parseJudges(this._metadata);
    }

    parseJudges(htmlString: string): BoxrecJudge[] {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        let judges: BoxrecJudge[] = [];

        html.find("a").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/judge\/(\d+)$/);

            if (matches && matches[1]) {
                const id: number = parseInt(matches[1], 10);
                let name: string = $(elem).text();
                name = trimRemoveLineBreaks(name);

                const scoreCardRegex: RegExp = /<\/a>\s(\d{1,3})-(\d{1,3})/g;
                let scorecard: number[] = [];

                let m: RegExpExecArray | null;
                let i: number = 0;
                do {
                    m = scoreCardRegex.exec(htmlString);
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

    get referee(): BoxrecBasic {
        return this.parseReferee(this._metadata);
    }

    parseReferee(htmlString: string): BoxrecBasic {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
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

    get numberOfRounds(): (number | null)[] {
        return this.parseNumberOfRounds(this._numberOfRounds);
    }

    parseNumberOfRounds(htmlString: string): (number | null)[] {
        let numberOfRounds: (number | null)[] = [null, null];

        const splitRounds: string[] = htmlString.trim().split("/");
        const formattedSplitRounds: number[] = splitRounds.map(item => parseInt(item, 10));
        if (formattedSplitRounds.length === 2) {
            numberOfRounds = formattedSplitRounds;
        } else if (formattedSplitRounds.length === 1 && !isNaN(formattedSplitRounds[0])) {
            numberOfRounds = [null, formattedSplitRounds[0]];
        }

        return numberOfRounds;
    }

    parseOutcome(htmlString: string): WinLossDraw {
        let outcome: string = htmlString;
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

    // maybe there's additional things that people would want to sift through
    get titles(): BoxrecId[] {
        return this.parseTitles(this._metadata);
    }

    parseTitles(htmlString: string): BoxrecId[] {
        let titles: BoxrecId[] = [];
        const html: Cheerio = $(`<div>${htmlString}</div>`);
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

    parseOutcomeByWayOf(htmlString: string, parseText: boolean = false): BoxingBoutOutcome | string | null {
        if (trimRemoveLineBreaks(htmlString)) {
            const html: Cheerio = $(`<div>${htmlString}</div>`);
            html.find("div").remove();
            let outcomeByWayOf: string = html.text();
            outcomeByWayOf = outcomeByWayOf.trim();

            if (parseText) {
                return BoxingBoutOutcome[outcomeByWayOf as any];
            }

            return outcomeByWayOf;
        }

        return null;
    }

    parseCareer(htmlString: string): (number | null)[] {
        const career: string = htmlString;
        const careerMatches: RegExpMatchArray | null = career.match(/(\d{4})-(\d{4})/);
        if (careerMatches && careerMatches.length === 3) {
            return [parseInt(careerMatches[1], 10), parseInt(careerMatches[2], 10)];
        }
        return [null, null];
    }

    /**
     * Can parse the id, town, region, country from multiple links
     * @param {string} htmlString       passed in HTML string, more than likely the contents of an HTML table column
     * @param {number} linkToLookAt     Sometimes the format is `town, region, country`.  Other times it is `country, region, town`
     * @returns {Location}
     */
    parseLocationLink(htmlString: string, linkToLookAt: number = 0): Location {
        let location: Location = {
            id: null,
            town: null,
            region: null,
            country: null,
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        const links: Cheerio = html.find("a");

        if (links.get(linkToLookAt)) {
            const link: CheerioElement = links.get(linkToLookAt);
            // the following regex assumes the query string is always in the same format
            // `region` and `town` are wrapped with a conditional statement, in some instances the URL just contains ex. `?country=US`
            const areaRegex: RegExp = /\?country=([A-Za-z]+)(?:&region=([A-Za-z]*))?(?:&town=(\d+))?/;
            const matches: RegExpMatchArray | null = link.attribs.href.match(areaRegex) as string[];

            if (matches) {
                const [, country, region, townId] = matches;

                if (links) {
                    const data: CheerioElement = link;
                    if (data) {
                        // if no `townId` exists, this innerText is not the `town` and is something else
                        const innerText: string | undefined = data.children[0].data;
                        if (townId && innerText) {
                            location.town = innerText;
                        }
                        location.country = country || null;
                        location.region = region || null;
                        location.id = parseInt(townId, 10) || null;
                    }
                }
            }
        }

        return location;
    }

    parseId(htmlString: string): number | null {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        const href: string = html.find("a").attr("href");

        if (href) {
            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);

            if (matches && matches[1]) {
                return parseInt(matches[1], 10);
            }
        }

        return null;
    }

    parseName(htmlString: string): string {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        let name: string = html.text();
        name = trimRemoveLineBreaks(name);

        if (name.slice(-1) === "*") {
            name = name.slice(0, -1);
        }

        return name;
    }

    // maybe there's additional things that people would want to sift through
    get metadata(): string {
        return this._metadata;
    }

    get result(): [WinLossDraw, BoxingBoutOutcome | string | null, BoxingBoutOutcome | string | null] {
        return [this.outcome, this.outcomeByWayOf(), this.outcomeByWayOf(true)];
    }

    get outcome(): WinLossDraw {
        return this.parseOutcome(this._outcome);
    }

    protected parseWeight(str: string): number | null {
        const weight: string = str.trim();
        let formattedWeight: number | null = null;

        if (weight.length) {
            formattedWeight = parseInt(weight, 10);

            if (isNaN(parseInt(weight.slice(-1), 10))) {
                formattedWeight += convertFractionsToNumber(weight.slice(-1));
            }
        }

        return formattedWeight;
    }

    private outcomeByWayOf(parseText: boolean = false): BoxingBoutOutcome | string | null {
        return this.parseOutcomeByWayOf(this._outcomeByWayOf, parseText);
    }

}
