import {BoxrecCommonTablesColumnsClass} from "../../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoxrecTitles} from "../../../boxrec-common-tables/boxrec-common.constants";
import {OutputGetter, OutputInterface} from "../../../decorators/output.decorator";
import {convertFractionsToNumber, parseHeight, trimRemoveLineBreaks} from "../../../helpers";
import {BoxrecBasic, BoxrecJudge, Record, Stance, WinLossDraw} from "../../boxrec.constants";
import {WeightDivision} from "../../champions/boxrec.champions.constants";
import {BoxingBoutOutcome, BoxingBoutOutcomeKeys} from "../boxrec.event.constants";
import {BoxrecPageEvent} from "../boxrec.page.event";
import {
    BoutPageBoutOutcome,
    BoutPageLast6,
    BoutPageOutcome,
    BoxrecEventBoutOutput
} from "./boxrec.event.bout.constants";

/**
 * Parse a BoxRec bout page
 * Note: because BoxRec is using inline styles for a lot of things, can't guarantee perfect results.  Report issues
 * <pre>http://boxrec.com/en/event/726555/2037455</pre>
 */
@OutputGetter([
    "bouts", "commission", "date", "division", "doctors", "firstBoxer", "firstBoxerAge",
    "firstBoxerHeight", "firstBoxerKOs", "firstBoxerLast6", "firstBoxerPointsAfter",
    "firstBoxerRanking", "firstBoxerReach", "firstBoxerRecord",
    "firstBoxerStance", "id", "inspector", "judges", "location", "matchmakers", "media",
    "numberOfBouts", "numberOfRounds", "outcome", "promoters", "rating", "referee",
    "secondBoxer", "secondBoxerAge", "secondBoxerHeight", "secondBoxerKOs",
    "secondBoxerLast6", "secondBoxerPointsAfter",
    "secondBoxerRanking", "secondBoxerReach", "secondBoxerRecord", "secondBoxerStance",
    "television", "titles",
])
export class BoxrecPageEventBout extends BoxrecPageEvent implements OutputInterface {

    output: BoxrecEventBoutOutput;

    private static parseOutcome(outcomeStr: string): BoutPageOutcome {
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
                outcomeObj.outcome = BoxrecCommonTablesColumnsClass.parseOutcome(secondMatch);
            } else {
                // is the second boxer
                outcomeObj.outcomeByWayOf = values[secondMatch] as BoxingBoutOutcome;
                outcomeObj.outcome = BoxrecCommonTablesColumnsClass.parseOutcome(firstMatch);
            }
        }

        return outcomeObj;
    }

    get date(): string | null {
        let date: string | null = this.$(".page h2:nth-child(1) a").text();

        if (date) {
            date = trimRemoveLineBreaks(date);
            return new Date(date).toISOString().slice(0, 10);
        }

        return date;
    }

    get division(): WeightDivision | null {
        return BoxrecCommonTablesColumnsClass.parseDivision(this.parseDivision("division"));
    }

    get firstBoxer(): BoxrecBasic {
        const boxer: string = this.parseBoxers("first");
        return BoxrecCommonTablesColumnsClass.parseNameAndId(boxer);
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
        return this.parseLast6Object(true);
    }

    get firstBoxerPointsAfter(): number | null {
        return this.parsePoints(false, 1);
    }

    get firstBoxerRanking(): number | null {
        return this.parseRankingData(1);
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
        const judgesArr: string[] = this.parseJudges();

        judgesArr.forEach(item => {
            const judgeEl: Cheerio = this.$(`<tr>${item}</tr>`);
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
                const {id, name} = BoxrecCommonTablesColumnsClass.parseNameAndId(nameAndId);
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

    /**
     * Returns a number of rounds sanctioned for this bout if it has that number
     * @returns {number | null}
     */
    get numberOfRounds(): number | null {
        const numberOfRounds: string = this.parseDivision("numberOfRounds");
        if (numberOfRounds) {
            return parseInt(numberOfRounds, 10);
        }

        return null;
    }

    get outcome(): BoutPageBoutOutcome {
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
                boxerStr = this.$.html(objRow[0].find(".personLink")[0]);
                outcomeString = textWon[0].children[0].data;
            } else {
                // second boxer won
                boxerStr = this.$.html(objRow[0].find(".personLink")[1]);
                outcomeString = textWonSecond[0].children[0].data;
            }

            if (outcomeString) {
                const outcomeResult: BoutPageOutcome = this.parseOutcomeOfBout(outcomeString);
                outcome.outcome = outcomeResult.outcome;
                outcome.outcomeByWayOf = outcomeResult.outcomeByWayOf;
            }

            const boxer: BoxrecBasic = BoxrecCommonTablesColumnsClass.parseNameAndId(boxerStr);
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

    get rating(): number | null {
        // todo what about the half star if or no stars?
        const fullStarClassName: string = ".fa-star";
        const halfStarClassName: string = ".fa-half-star";
        let starRating: string | null = this.$(`${fullStarClassName},${halfStarClassName}`).parents("div").html();
        if (starRating) {
            starRating = `<div>${starRating}</div>`;

            return BoxrecCommonTablesColumnsClass.parseRating(starRating, fullStarClassName, halfStarClassName);
        }

        return null;
    }

    get referee(): BoxrecBasic {
        const refereeLink: string = this.$.html(this.$(".responseLessDataTable a:nth-child(1)").get(0));

        return BoxrecCommonTablesColumnsClass.parseReferee(refereeLink);
    }

    get secondBoxer(): BoxrecBasic {
        const boxer: string = this.parseBoxers("second");
        return BoxrecCommonTablesColumnsClass.parseNameAndId(boxer);
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
        return this.parseLast6Object(false);
    }

    get secondBoxerPointsAfter(): number | null {
        return this.parsePoints(false, 3);
    }

    get secondBoxerRanking(): number | null {
        return this.parseRankingData(3);
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
        const titles: string | null = this.parseTitles();
        return BoxrecCommonTablesColumnsClass.parseTitles(titles || "");
    }

    // this is different than the others found on date/event page
    protected getPeopleTable(): Cheerio {
        return this.$("h1").parent().find("table").last().find("tbody tr");
    }

    /**
     * Searches page for table columns with `b` tag where the text matches
     * @param {string} textToFind
     * @returns {Cheerio}
     */
    private findColumnByText(textToFind: string = ""): Cheerio {
        const filteredCheerio: Cheerio = this.$("td b").filter((index: number, elem: CheerioElement) => {
            return this.$(elem).text().trim() === textToFind;
        });

        if (filteredCheerio.length > 1) {
            throw new Error("found two columns with the same name, please report this");
        }

        return filteredCheerio;
    }

    private getBoxersSideObjRow(): Cheerio[] {
        const boxers: Cheerio[] = [];

        this.$("table .personLink").each((i: number, elem: CheerioElement) => {
            const href: string = this.$(elem).attr("href");

            if (href.includes("boxer") && boxers.length < 2) {
                boxers.push(this.$(elem).parent().parent().parent());
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

    private parseBoxerAge(tableColumn: number): number | null {
        const text: string = this.parseMiddleRowByText("age", tableColumn) as string;

        if (text) {
            return parseInt(text, 10);
        }

        return null;
    }

    private parseBoxerHeight(tableColumn: number): number[] | null {
        let text: string = this.parseMiddleRowByText("height", tableColumn) as string;
        text = trimRemoveLineBreaks(text); // found there was a line break at the end of this text and double spaces

        return parseHeight(text);
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

    private parseBoxers(boxer: "first" | "second"): string {
        const name: string[] = [];
        const alreadyAdded: string[] = [];

        this.$("table a").each((i: number, elem: CheerioElement) => {
            const href: string = this.$(elem).attr("href");

            if (name.length < 2 && href.includes("boxer") && !alreadyAdded.find(item => item === href)) {
                alreadyAdded.push(href);
                name.push(this.$.html(this.$(elem)));
            }
        });

        if (boxer === "first" && name[0]) {
            return name[0];
        } else if (boxer === "second" && name[1]) {
            return name[1];
        }

        return "";
    }

    private parseDivision(type: "division" | "numberOfRounds"): string {
        const h2: CheerioElement = this.$("h2").get(1);

        if (h2) {
            const division: string | undefined = h2.children[0].data; // ex. Middleweight Contest, 12 Rounds

            if (division) {
                const divisionMatches: RegExpMatchArray | null = division.match(/^(\w+).*\,\s?(\d{1,2})?/);

                if (!divisionMatches) {
                    return "";
                }

                if (type === "division" && divisionMatches[1]) {
                    return divisionMatches[1];
                }

                // I assume there's some matches where we know the division but not the number of rounds
                if (type === "numberOfRounds" && divisionMatches[2]) {
                    return divisionMatches[2];
                }
            }
        }

        return "";
    }

    private parseJudges(): string[] {
        const links: Cheerio = this.$(".responseLessDataTable a");
        const judges: string[] = [];

        links.each((i: number, elem: CheerioElement) => {
            const href: string = this.$(elem).attr("href");

            if (href.includes("judge")) {
                const judgeString: string = this.$.html(this.$(elem).parent().parent());
                judges.push(judgeString);
            }
        });

        return judges;
    }

    private parseLast6(boxer: "first" | "second"): string[] {
        let ranking: Cheerio = this.parseMiddleRowByText("last 6") as Cheerio;
        const boxerArr: string[] = [];

        for (let i: number = 0; i < 6; i++) {
            ranking = ranking.next();

            const tableFirst: Cheerio = ranking.find("td:nth-child(1) table");
            const tableSecond: Cheerio = ranking.find("td:nth-child(3) table");

            if (tableFirst && boxer === "first") {
                const firstBoxerTable: string = this.$.html(tableFirst);
                boxerArr.push(firstBoxerTable);
            }

            if (tableSecond && boxer === "second") {
                const secondBoxerTable: string = this.$.html(tableSecond);
                boxerArr.push(secondBoxerTable);
            }
        }

        return boxerArr;
    }

    private parseLast6Object(isFirstBoxer: boolean): BoutPageLast6[] {
        const parsedBoxerLast6: BoutPageLast6[] = [];
        const last6: string[] = this.parseLast6(isFirstBoxer ? "first" : "second");

        for (const last of last6) {
            const obj: BoutPageLast6 = {
                date: null,
                id: null,
                name: null,
                outcome: null,
                outcomeByWayOf: null,
            };
            const table: Cheerio = this.$(last);
            let idName: BoxrecBasic = {
                id: null,
                name: null,
            };

            let outcomeStr: string | null = null;

            if (isFirstBoxer) {

                const idNameStr: string = this.$.html(table.find("td:nth-child(1) a"));
                idName = BoxrecCommonTablesColumnsClass.parseNameAndId(idNameStr);
            } else {
                outcomeStr = table.find("td:nth-child(1) span").html();
            }

            const dateStr: string = this.$.html(table.find("td:nth-child(2) a"));
            const date: string | null = BoxrecCommonTablesColumnsClass.parseNameAndId(dateStr).name;

            if (isFirstBoxer) {
                outcomeStr = table.find("td:nth-child(3) span").html();
            } else {
                const idNameStr: string = this.$.html(table.find("td:nth-child(3) a"));
                idName = BoxrecCommonTablesColumnsClass.parseNameAndId(idNameStr);
            }

            if (outcomeStr) {
                const {outcome, outcomeByWayOf} = BoxrecPageEventBout.parseOutcome(outcomeStr);
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

    private parseOutcomeOfBout(outcomeText: string): BoutPageOutcome {
        const splitDrawText: string[] = outcomeText.split(" ");
        const outcomeKeys: string[] = Object.keys(BoxingBoutOutcome);
        const foundKey: string | undefined = outcomeKeys.find(item => item === splitDrawText[1]);

        // if it finds the key in the enum, we can return it as that type
        if (foundKey) {
            const outcomeByWayOf: BoxingBoutOutcome = BoxingBoutOutcome[foundKey as BoxingBoutOutcomeKeys];

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

    private parseRanking(): string {
        const ranking: Cheerio = this.parseMiddleRowByText("ranking") as Cheerio;
        return this.$.html(ranking.next());
    }

    private parseRankingData(columnNumber: number = 1): number | null {
        const ranking: Cheerio = this.$(this.parseRanking());
        const td: Cheerio = ranking.find(`td:nth-child(${columnNumber})`);

        if (td.text()) {
            return parseInt(td.text(), 10);
        }

        return null;
    }

    private parseTitles(): string | null {
        return this.$(".titleColor").html();
    }

}
