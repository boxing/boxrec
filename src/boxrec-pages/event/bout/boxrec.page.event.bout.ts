import cheerio = require("cheerio");
import {convertFractionsToNumber, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecCommonTablesClass} from "../../boxrec-common-tables/boxrec-common-tables.class";
import {BoxrecTitles} from "../../boxrec-common-tables/boxrec-common.constants";
import {BoxrecBasic, BoxrecJudge, Record, Stance, WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxingBoutOutcome} from "../boxrec.event.constants";
import {BoxrecPageEvent} from "../boxrec.page.event";
import {BoutPageBoutOutcome, BoutPageLast6, BoutPageOutcome} from "./boxrec.event.bout.constants";

let $: CheerioStatic;

/**
 * Parse a BoxRec bout page
 * Note: because BoxRec is using inline styles for a lot of things, can't guarantee perfect results.  Report issues
 * <pre>http://boxrec.com/en/event/726555/2037455</pre>
 */
export class BoxrecPageEventBout extends BoxrecPageEvent {

    private _division: string;
    private _firstBoxerLast6: string[] = [];
    private _judges: string[] = [];
    private _name: string[] = [];
    private _numberOfRounds: string;
    private _outcome: BoutPageBoutOutcome;
    private _ranking: string = "";
    private _rating: number;
    private _referee: string;
    private _secondBoxerLast6: string[] = [];
    private _titles: string;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        $ = cheerio.load(boxrecBodyString);
        this.parse();
        this.parseBoxers();
        this.parseJudges();
        this.parseDoctors();
        this.parseMatchmakers();
        this.parsePromoters();
        this.parseDivision();
        this.parseTable();
        this.parseRanking();
        this.parseLast6();
        this.parseTitles();
        this.parseLocation();
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesClass.parseDivision(this._division);
    }

    get firstBoxer(): BoxrecBasic {
        const boxer: string = this._name[0];
        return BoxrecCommonTablesClass.parseNameAndId(boxer);
    }

    get firstBoxerAge(): number | null {
        return this.parseBoxerAge(1);
    }

    get firstBoxerHeight(): number[] | null {
        return this.parseBoxerHeight(1);
    }

    get firstBoxerKOs(): number {
        return this.getKOs(1);
    }

    get firstBoxerLast6(): BoutPageLast6[] {
        return this.parseLast6Object(this._firstBoxerLast6, true);
    }

    get firstBoxerPointsAfter(): number | null {
        return this.parsePoints(false, 1);
    }

    get firstBoxerPointsBefore(): number | null {
        return this.parsePoints(true, 1);
    }

    get firstBoxerRanking(): number | null {
        const ranking: Cheerio = $(this._ranking);
        const td: Cheerio = ranking.find("td:nth-child(1)");

        if (td) {
            return parseInt(td.text(), 10);
        }

        return null;
    }

    get firstBoxerReach(): number[] | null {
        return this.parseBoxerReach(1);
    }

    get firstBoxerRecord(): Record {
        return this.getRecord(1);
    }

    get firstBoxerStance(): Stance | null {
        return this.parseBoxerStance(1);
    }

    get judges(): BoxrecJudge[] {
        const judges: BoxrecJudge[] = [];
        const judgesArr: string[] = this._judges;

        judgesArr.forEach(item => {
            const judgeEl: Cheerio = $(`<tr>${item}</tr>`);
            const judgeObj: BoxrecJudge = {
                id: null,
                name: null,
                scorecard: [],
            };

            const firstRating: string | null = judgeEl.find("td:nth-child(1)").text();
            const nameAndId: string | null = judgeEl.find("td:nth-child(2)").html();
            const secondRating: string | null = judgeEl.find("td:nth-child(3)").text();

            if (firstRating) {
                judgeObj.scorecard[0] = parseInt(firstRating, 10);
            }

            if (nameAndId) {
                const {id, name} = BoxrecCommonTablesClass.parseNameAndId(nameAndId);
                judgeObj.id = id;
                judgeObj.name = name;
            }

            if (secondRating) {
                judgeObj.scorecard[1] = parseInt(secondRating, 10);
            }

            judges.push(judgeObj);
        });

        return judges;
    }

    get numberOfRounds(): number | null {
        const numberOfRounds: string = this._numberOfRounds;
        if (numberOfRounds) {
            return parseInt(numberOfRounds, 10);
        }

        return null;
    }

    get outcome(): BoutPageBoutOutcome {
        if (!this._outcome) {
            this._outcome = this.parseBoutOutcome();
        }

        return this._outcome;
    }

    get rating(): number | null {
        return this._rating;
    }

    get referee(): BoxrecBasic {
        return BoxrecCommonTablesClass.parseReferee(this._referee);
    }

    get secondBoxer(): BoxrecBasic {
        const boxer: string = this._name[1];
        return BoxrecCommonTablesClass.parseNameAndId(boxer);
    }

    get secondBoxerAge(): number | null {
        return this.parseBoxerAge(3);
    }

    get secondBoxerHeight(): number[] | null {
        return this.parseBoxerHeight(3);
    }

    get secondBoxerKOs(): number {
        return this.getKOs(3);
    }

    get secondBoxerLast6(): BoutPageLast6[] {
        return this.parseLast6Object(this._secondBoxerLast6, false);
    }

    get secondBoxerPointsAfter(): number | null {
        return this.parsePoints(false, 3);
    }

    get secondBoxerPointsBefore(): number | null {
        return this.parsePoints(true, 3);
    }

    get secondBoxerRanking(): number | null {
        const ranking: Cheerio = $(this._ranking);
        const td: Cheerio = ranking.find("td:nth-child(3)");

        if (td) {
            return parseInt(td.text(), 10);
        }

        return null;
    }

    get secondBoxerReach(): number[] | null {
        return this.parseBoxerReach(3);
    }

    get secondBoxerRecord(): Record {
        return this.getRecord(3);
    }

    get secondBoxerStance(): Stance | null {
        return this.parseBoxerStance(3);
    }

    get titles(): BoxrecTitles[] {
        return BoxrecCommonTablesClass.parseTitles(this._titles);
    }

    /**
     * Searches page for table columns with `b` tag where the text matches
     * @param {string} textToFind
     * @returns {Cheerio}
     */
    private findColumnByText(textToFind: string = ""): Cheerio {
        const filteredCheerio: Cheerio = $("td b").filter(function(this: any): boolean {
            const elem: any = $(this);
            return elem.text().trim() === textToFind;
        });

        if (filteredCheerio.length > 1) {
            throw new Error("found two columns with the same name, please report this");
        }

        return filteredCheerio;
    }

    private getBoxersSideObjRow(): Cheerio[] {
        const boxers: Cheerio[] = [];

        $("table .personLink").each((i: number, elem: CheerioElement) => {
            const href: string = $(elem).attr("href");

            if (href.includes("boxer") && boxers.length < 2) {
                boxers.push($(elem).parent().parent().parent());
            }
        });

        return boxers;
    }

    private getKOs(tableColumn: number): number {
        const knockouts: string = this.parseMiddleRowByText("KOs", tableColumn) as string;
        return parseInt(knockouts, 10);
    }

    private getRecord(tableColumn: number): Record {
        const won: string = this.parseMiddleRowByText("won", tableColumn) as string;
        const lost: string = this.parseMiddleRowByText("lost", tableColumn) as string;
        const drawn: string = this.parseMiddleRowByText("drawn", tableColumn) as string;

        return {
            draw: parseInt(drawn, 10),
            loss: parseInt(lost, 10),
            win: parseInt(won, 10),
        };
    }

    private parse(): void {
        // date
        const date: string = $(".page h2:nth-child(1)").text(); // ex. Saturday 5, May 2018
        if (date) {
            this._date = new Date(date).toISOString().slice(0, 10);
        }

        // rating
        let starRating: string | null = $(".starRating").parent().html();
        if (starRating) {
            starRating = `<div>${starRating}</div>`;
            const ratingString: number | null = BoxrecCommonTablesClass.parseRating(starRating);

            if (ratingString) {
                this._rating = ratingString;
            }
        }

    }

    /**
     * Used to get the string of the table row which is promoter, matchmaker, doctors, etc.
     * @param {string} textToFind
     * @returns {string | null}
     */
    private parseBottomDoctorPromoterRows(textToFind: string = ""): string | null {
        const filteredColumn: Cheerio = this.findColumnByText(textToFind);
        return filteredColumn.parent().next().html();
    }

    private parseBoutOutcome(): BoutPageBoutOutcome {
        const outcome: BoutPageBoutOutcome = {
            boxer: {
                id: null,
                name: null,
            },
            outcome: null,
            outcomeByWayOf: null
        };

        const objRow: Cheerio[] = this.getBoxersSideObjRow();
        const textWon: Cheerio = objRow[0].find(".textWon");
        const textWonSecond: Cheerio = objRow[1].find(".textWon");
        const textDraw: Cheerio = objRow[0].find(".textDrawn");

        if (textWon.length === 1 || textWonSecond.length === 1) {
            let boxerStr: string = "";
            let outcomeString: string | undefined;
            if (textWon.length === 1) {
                // first boxer won
                boxerStr = $.html(objRow[0].find(".personLink")[0]);
                outcomeString = textWon[0].children[0].data;
            } else {
                // second boxer won
                boxerStr = $.html(objRow[0].find(".personLink")[1]);
                outcomeString = textWonSecond[0].children[0].data;
            }

            if (outcomeString) {
                const outcomeResult: BoutPageOutcome = this.parseOutcomeOfBout(outcomeString);
                outcome.outcome = outcomeResult.outcome;
                outcome.outcomeByWayOf = outcomeResult.outcomeByWayOf;
            }

            const boxer: BoxrecBasic = BoxrecCommonTablesClass.parseNameAndId(boxerStr);
            outcome.boxer.id = boxer.id;
            outcome.boxer.name = boxer.name;

        } else if (textDraw.length === 2) {
            // outcome was a draw
            outcome.outcome = WinLossDraw.draw;
            // i'm assuming the first boxer should always have the draw info
            const firstBoxerDrawText: string | undefined = textDraw[0].children[0].data;

            if (firstBoxerDrawText) {
                const outcomeResult: BoutPageOutcome = this.parseOutcomeOfBout(firstBoxerDrawText);
                outcome.outcomeByWayOf = outcomeResult.outcomeByWayOf;
            }
        }

        return outcome;
    }

    private parseBoxerAge(tableColumn: number): number | null {
        const text: string = this.parseMiddleRowByText("age", tableColumn) as string;

        if (text) {
            return parseInt(text, 10);
        }

        return null;
    }

    private parseBoxerHeight(tableColumn: number): number[] | null {
        let text: string = this.parseMiddleRowByText("height", tableColumn) as string;

        // todo this whole thing is taken from `boxrec.page.profile` the regex is the only thing different
        if (text) {
            text = trimRemoveLineBreaks(text); // found there was a line break at the end of this text and double spaces
            let height: number[] | null = null;

            text = trimRemoveLineBreaks(text);

            if (text) {
                // todo this regex is very close to `boxrec.page.profile` but there were some differences
                // this regex was built off GGG Canelo 1 Bout // 5′ 10½″   /   179cm
                // todo then trimmed up above, also it came back as the actual symbols instead of unicode codes?
                // todo the regexp are different and this code should still be merged together
                const regex: RegExp = /^(\d)(?:′|\&\#x2032\;)\s(\d{1,2})(½|\&\#xB[CDE]\;)?(?:″|\&\#x2033\;)\s+(?:\/|\&\#xA0\;)\s+(\d{3})cm$/;
                const heightMatch: RegExpMatchArray | null = text.match(regex);

                if (heightMatch) {
                    const [, imperialFeet, imperialInches, fractionInches, metric] = heightMatch;
                    let formattedImperialInches: number = parseInt(imperialInches, 10);
                    formattedImperialInches += convertFractionsToNumber(fractionInches);

                    height = [
                        parseInt(imperialFeet, 10),
                        formattedImperialInches,
                        parseInt(metric, 10),
                    ];
                }
            }

            return height;
        }

        return null;
    }

    private parseBoxerReach(tableColumn: number): number[] | null {
        let text: string = this.parseMiddleRowByText("reach", tableColumn) as string;
        text = trimRemoveLineBreaks(text); // found there was a line break at the end of this text and double spaces

        let reach: number[] | null = null;
        if (text) {
            const regex: RegExp = /^(\d{2})(¼|½|¾)?(?:″|\&\#x2033\;)\s(?:\/|\&\#xA0\;\s)\s(?:\/|\&\#xA0\;)?(\d{3})cm$/;
            const reachMatch: RegExpMatchArray | null = text.match(regex);

            if (reachMatch) {
                const [, inches, fraction, centimeters] = reachMatch;

                let parsedInches: number = parseInt(inches, 10);

                if (fraction) {
                    parsedInches += convertFractionsToNumber(fraction);
                }

                reach = [
                    parsedInches,
                    parseInt(centimeters, 10),
                ];
            }
        }

        return reach;
    }

    /**
     * Parses the boxer row
     * @param {number} tableColumn  needs to be the first or third column
     * @returns {Stance | null}
     */
    private parseBoxerStance(tableColumn: number): Stance | null {
        const text: string = this.parseMiddleRowByText("stance", tableColumn) as string;

        if (text) {
            return trimRemoveLineBreaks(text) as Stance;
        }

        return null;
    }

    private parseBoxers(): void {
        this._name = [];
        const alreadyAdded: string[] = [];

        $("table a").each((i: number, elem: CheerioElement) => {
            const href: string = $(elem).attr("href");

            if (this._name.length < 2 && href.includes("boxer") && !alreadyAdded.find(item => item === href)) {
                alreadyAdded.push(href);
                this._name.push($.html($(elem)));
            }
        });
    }

    private parseDivision(): void {
        const h2: CheerioElement = $("h2").get(2);

        if (h2) {
            const division: string | undefined = h2.children[0].data; // ex. Middleweight Contest, 12 Rounds

            if (division) {
                const divisionMatches: RegExpMatchArray | null = division.match(/^(\w+).*\,\s?(\d{1,2})?/);

                if (!divisionMatches) {
                    return;
                }

                if (divisionMatches[1]) {
                    this._division = divisionMatches[1];
                }

                // I assume there's some matches where we know the division but not the number of rounds
                if (divisionMatches[2]) {
                    this._numberOfRounds = divisionMatches[2];
                }
            }
        }
    }

    private parseDoctors(): void {
        const doctor: string | null = this.parseBottomDoctorPromoterRows("doctor");

        if (doctor) {
            this._doctor = doctor;
        }
    }

    private parseJudges(): void {
        const links: Cheerio = $(".responseLessDataTable a");
        const judges: string[] = [];

        links.each((i: number, elem: CheerioElement) => {
            const href: string = $(elem).attr("href");

            if (href.includes("judge")) {
                const judgeString: string = $.html($(elem).parent().parent());
                judges.push(judgeString);
            }
        });

        this._judges = judges;
    }

    private parseLast6(): void {
        let ranking: Cheerio = this.parseMiddleRowByText("last 6") as Cheerio;

        for (let i: number = 0; i < 6; i++) {
            ranking = ranking.next();

            const tableFirst: Cheerio = ranking.find("td:nth-child(1) table");
            const tableSecond: Cheerio = ranking.find("td:nth-child(3) table");

            if (tableFirst) {
                const firstBoxerTable: string = $.html(tableFirst);
                this._firstBoxerLast6.push(firstBoxerTable);
            }

            if (tableSecond) {
                const secondBoxerTable: string = $.html(tableSecond);
                this._secondBoxerLast6.push(secondBoxerTable);
            }
        }
    }

    private parseLast6Object(last6: string[], isFirstBoxer: boolean): BoutPageLast6[] {
        const parsedBoxerLast6: BoutPageLast6[] = [];

        for (const last of last6) {
            const obj: BoutPageLast6 = {
                date: null,
                id: null,
                name: null,
                outcome: null,
                outcomeByWayOf: null,
            };
            const table: Cheerio = $(last);
            let idName: BoxrecBasic = {
                id: null,
                name: null,
            };

            let outcomeStr: string | null = null;

            if (isFirstBoxer) {
                const idNameStr: string = $.html(table.find("td:nth-child(1) a"));
                idName = BoxrecCommonTablesClass.parseNameAndId(idNameStr);
            } else {
                outcomeStr = table.find("td:nth-child(1) span").html();
            }

            const dateStr: string = $.html(table.find("td:nth-child(2) a"));
            // todo this is kind of abuse of this method but it works
            const date: string | null = BoxrecCommonTablesClass.parseNameAndId(dateStr).name;

            if (isFirstBoxer) {
                outcomeStr = table.find("td:nth-child(3) span").html();
            } else {
                const idNameStr: string = $.html(table.find("td:nth-child(3) a"));
                idName = BoxrecCommonTablesClass.parseNameAndId(idNameStr);
            }

            if (outcomeStr) {
                const {outcome, outcomeByWayOf} = this.parseOutcome(outcomeStr);
                obj.outcome = outcome;
                obj.outcomeByWayOf = outcomeByWayOf;
            }

            obj.id = idName.id;
            obj.name = idName.name;

            if (date) {
                obj.date = date;
            }

            parsedBoxerLast6.push(obj);
        }

        return parsedBoxerLast6;
    }

    // this is kind of a mess, there's a lot of elements just clumped together and using br
    private parseLocation(): void {
        const elems: Cheerio = $(".page h2:nth-child(1)").parent();
        const href: string = elems.find("a:nth-child(1)").attr("href");

        if (href && href.includes("date")) {
            elems.find("a:nth-child(1)").remove();
        }

        // remove elements not related to location/venue
        elems.find(".titleColor").remove();
        elems.find(".eventP").parent().remove();

        const html: string | null = elems.html();

        if (html) {
            this._location = html;
        }
    }

    private parseMatchmakers(): void {
        const matchmaker: string | null = this.parseBottomDoctorPromoterRows("matchmaker");

        if (matchmaker) {
            this._matchmaker = matchmaker;
        }
    }

    /**
     * Used to get the string of the table row where the stats are to the left/right of it (ex. age, height)
     * @param {string} textToFind
     * @param {number} tableColumn
     * @returns {Cheerio | string}
     */
    private parseMiddleRowByText(textToFind: string = "", tableColumn: number = -1): Cheerio | string {
        // the returned elem is `td b` so we go up 2 and then find the column we want
        const filteredRow: Cheerio = this.findColumnByText(textToFind).parent().parent();

        if (tableColumn >= 0) {
            return filteredRow.find(`td:nth-child(${tableColumn})`).text();
        }

        // if no table column is specified we return the entire row
        return filteredRow;
    }

    private parseOutcome(outcomeStr: string): BoutPageOutcome {
        const trimmedOutcomeStr: string = trimRemoveLineBreaks(outcomeStr);
        const matches: RegExpMatchArray | null = trimmedOutcomeStr.match(/^(\w+)\s(\w+)$/);

        const outcomeObj: BoutPageOutcome = {
            outcome: null,
            outcomeByWayOf: null,
        };

        if (matches) {
            const firstMatch: string = matches[1];
            const secondMatch: string = matches[2];
            const values: any = BoxingBoutOutcome;

            // the outcome table column is flipped depending if they are the first or second boxer
            if (firstMatch.length > 1) {
                // is the first boxer
                outcomeObj.outcomeByWayOf = values[firstMatch] as BoxingBoutOutcome;
                outcomeObj.outcome = BoxrecCommonTablesClass.parseOutcome(secondMatch);
            } else {
                // is the second boxer
                outcomeObj.outcomeByWayOf = values[secondMatch] as BoxingBoutOutcome;
                outcomeObj.outcome = BoxrecCommonTablesClass.parseOutcome(firstMatch);
            }
        }

        return outcomeObj;
    }

    private parseOutcomeOfBout(outcomeText: string): BoutPageOutcome {
        const splitDrawText: string[] = outcomeText.split(" ");
        const outcomeKeys: string[] = Object.keys(BoxingBoutOutcome);
        const foundKey: string | undefined = outcomeKeys.find(item => item === splitDrawText[1]);

        // if it finds the key in the enum, we can return it as that type
        if (foundKey) {
            const outcomeByWayOf: BoxingBoutOutcome = BoxingBoutOutcome[foundKey as any] as BoxingBoutOutcome;

            return {
                outcome: WinLossDraw.win,
                outcomeByWayOf,
            };
        }

        return {
            outcome: null,
            outcomeByWayOf: null,
        };
    }

    private parsePoints(beforePoints: boolean = true, tableColumn: number): number | null {
        const strToSearch: string = beforePoints ? "before fight" : "after fight";
        const points: string = this.parseMiddleRowByText(strToSearch, tableColumn) as string;
        const pointsParsed: RegExpMatchArray | null = points.match(/[\d\,]+/);

        if (pointsParsed) {
            pointsParsed[0] = pointsParsed[0].replace(",", "");
            return parseInt(pointsParsed[0], 10);
        }

        return null;
    }

    private parsePromoters(): void {
        const promoter: string | null = this.parseBottomDoctorPromoterRows("promoter");

        if (promoter) {
            this._promoter = promoter;
        }
    }

    private parseRanking(): void {
        const ranking: Cheerio = this.parseMiddleRowByText("ranking") as Cheerio;
        this._ranking = $.html(ranking.next());
    }

    private parseTable(): void {
        // referee // todo this could change or be omitted, it should be stricter
        const refereeLink: string = $.html($(".personLink").get(2));

        if (refereeLink) {
            this._referee = refereeLink;
        }
    }

    private parseTitles(): void {
        const titles: string | null = $(".titleColor").html();

        if (titles) {
            this._titles = titles;
        }
    }

}
