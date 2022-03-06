import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {BoutsGetter, BoutsInterface} from "../../decorators/bouts.decorator";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {parseHeight, trimRemoveLineBreaks} from "../../helpers";
import {Record, Stance} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecProfileBoxerOutput} from "./boxrec.page.profile.constants";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

/**
 * BoxRec Boxer Profile Page
 * <pre>ex. http://boxrec.com/en/boxer/155774</pre>
 */
// todo this is a bit flaky but the BoutsDecorator is restricted to using strings at this time
@BoutsGetter(".dataTable[width='100%']", BoxrecPageProfileBoxerBoutRow, 1, true)
@OutputGetter([
    "KOs", "alias", "birthName", "birthPlace", "born",
    {
        function: (bouts: BoxrecPageProfileBoxerBoutRow[]) => bouts.map(bout => bout.output),
        method: "bouts",
    }, "debut", "division", "globalId", "hasBoutScheduled",
    "height", "name", "nationality", "numberOfBouts", "otherInfo",
    "picture", "ranking", "rating", "reach", "record", "residence",
    "role", "rounds", "stance", "status", "suspended",
    "titlesHeld", "vadacbp",
])
export class BoxrecPageProfileBoxer extends BoxrecPageProfile implements BoutsInterface, OutputInterface {

    /**
     * Returns an array of bout information
     * The boxer's first bout is at the start of the array
     * The boxer's last or latest bout is at the end of the array
     * For all other roles, it is most recent first
     * @returns {BoxrecPageProfileBoxerBoutRow[]}
     */
    bouts: BoxrecPageProfileBoxerBoutRow[];
    output: BoxrecProfileBoxerOutput;

    /**
     * The number of bouts that this boxer has finished by way of KO/TKOing their opponent
     * @returns {number | null}
     */
    get KOs(): number | null {
        const ko: string | void = this.$(".profileWLD tr:nth-child(2) .textWon").text();

        if (ko) {
            const kos: number = parseInt(ko, 10);

            if (!isNaN(kos)) {
                return kos;
            }
        }

        return null;
    }

    /**
     * The alias or nickname of the boxer
     * @returns {string | null}
     */
    get alias(): string | null {
        const alias: string | void = this.parseProfileTableData(BoxrecProfileTable.alias);

        if (alias) {
            return BoxrecCommonTablesColumnsClass.parseAlias(alias);
        }

        return null;
    }

    /**
     * Returns the date of their professional debut bout
     * @returns {string | null}
     */
    get debut(): string | null {
        const debut: string | void = this.parseProfileTableData(BoxrecProfileTable.debut);

        if (debut) {
            return debut;
        }

        return null;
    }

    /**
     * Returns the boxer's division
     * This value can be missing
     * @returns {WeightDivision | null}
     */
    get division(): WeightDivision | null {
        const division: string | void = this.parseProfileTableData(BoxrecProfileTable.division);

        if (division) {
            return BoxrecCommonTablesColumnsClass.parseDivision(division);
        }

        return null;
    }

    /**
     * Returns an array of things this fighter is enrolled under
     * todo `sport` is broken when it comes to interface (boxrec-requests), it needs to be fixed to replace string
     */
    get enrollments(): Array<{ by: string, expires: string, id: number, sport: string }> {
        const enrollmentsTableData: Cheerio =
            this.$("h2:contains('Enrollments') + .boxerSectionContent table tbody tr");
        const enrollments: Array<{ by: string, expires: string, id: number, sport: string }> = [];

        if (enrollmentsTableData) {
            enrollmentsTableData.each((i: number, elem: CheerioElement): void => {
                const children: CheerioElement[] = this.$(elem).get(0).children;

                let by: string | undefined = children[0].children[0].data;
                let sport: string | undefined = children[1].children[0].data;
                let expires: string | undefined = children[2].children[0].data;
                const id: string | undefined = children[3].children[0].children[0].data;

                if (by && sport && expires && id) {
                    by = trimRemoveLineBreaks(by);
                    sport = trimRemoveLineBreaks(sport);
                    expires = trimRemoveLineBreaks(expires);
                    const idConverted: number = parseInt(trimRemoveLineBreaks(
                        id.replace(/\D+/, "")), 10);

                    enrollments.push({
                        by,
                        expires,
                        id: idConverted,
                        sport,
                    });
                }
            });
        }

        return enrollments;
    }

    /**
     * Returns whether the boxer has a bout scheduled or not
     * @example // Mike Tyson would return false
     * @returns {boolean}
     */
    get hasBoutScheduled(): boolean {
        return this.bouts.length > this.numberOfBouts;
    }

    /**
     * Returns the boxer's height
     * fractional symbols are changed to decimals.  ¼ = 0.25, ½ = 0.5, ¾ = 0.75
     * @returns {number[] | null}
     */
    get height(): number[] | null {
        const height: string | void = this.parseProfileTableData(BoxrecProfileTable.height);

        return parseHeight(height);
    }

    /**
     * Returns the nationality of the boxer
     * @returns {string | null}
     */
    get nationality(): string | null {
        const nationality: string | void = this.parseProfileTableData(BoxrecProfileTable.nationality);

        if (nationality) {
            return this.$(nationality).text().trimLeft();
        }

        return null;
    }

    /**
     * Returns the number of bouts this boxer has been in (excluding currently scheduled)
     * @returns {number}
     */
    get numberOfBouts(): number {
        const bouts: string | void = this.parseProfileTableData(BoxrecProfileTable.bouts);

        if (bouts) {
            return parseInt(bouts, 10);
        }

        return 0;
    }

    /**
     * Returns an array of where they stand in their division and in their country (by class)
     * @returns {number[][] | null}
     */
    get ranking(): number[][] | null {
        const ranking: string | null = this.parseRanking();

        if (ranking) {
            const html: Cheerio = this.$(`<div>${ranking}</div>`);
            const links: Cheerio = html.find("a");
            const rankings: number[][] = [];

            links.each((i: number, elem: CheerioElement) => {
                const text: string = this.$(elem).text();
                const parsedArr: number[] = text.trim().replace(",", "").split("/").map((str: string) => parseInt(str, 10));
                rankings.push(parsedArr);
            });

            return rankings;
        }

        return null;
    }

    /**
     * Returns the boxer's BoxRec star rating
     * this is not their ranking in their division or in their country
     * @returns {number | null}
     */
    get rating(): number | null {
        const rating: string | void = this.parseProfileTableData(BoxrecProfileTable.rating);
        const html: Cheerio = this.$(rating);

        if (html.get(0)) {
            const widthString: string = html.get(0).attribs.style;
            // this uses pixels, where the others use percentage
            const regex: RegExp = /width\:(\d+)px\;/;
            const matches: RegExpMatchArray | null = widthString.match(regex);

            if (matches && matches[1]) {
                return parseInt(matches[1], 10);
            }
        }

        return null;
    }

    /**
     * Returns the arm reach of the boxer
     * @returns {number[] | null}
     */
    get reach(): number[] | null {
        const reach: string | void = this.parseProfileTableData(BoxrecProfileTable.reach);

        if (reach) {
            const regex: RegExp = /^(\d{2})\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const reachMatch: RegExpMatchArray | null = reach.match(regex);

            if (reachMatch) {
                const [, inches, centimeters]: string[] = reachMatch;
                return [
                    parseInt(inches, 10),
                    parseInt(centimeters, 10),
                ];
            }
        }

        return null;
    }

    get record(): Record {
        const record: Record = {
            draw: null,
            loss: null,
            win: null,
        };
        // the record bar is the bar that above the profile that displays the record of the person
        const recordBar: Cheerio = this.$(".profileWLD tr:nth-child(1)");

        const win: string = recordBar.find("td:nth-child(1)").text();
        const loss: string = recordBar.find("td:nth-child(2)").text();
        const draw: string = recordBar.find("td:nth-child(3)").text();

        if (win) {
            record.win = parseInt(win, 10);
        }

        if (loss) {
            record.loss = parseInt(loss, 10);
        }

        if (draw) {
            record.draw = parseInt(draw, 10);
        }

        return record;
    }

    /**
     * Returns the number of rounds this boxer has been in in their professional career
     * @returns {number | null}
     */
    get rounds(): number | null {
        const rounds: string | void = this.parseProfileTableData(BoxrecProfileTable.rounds);

        if (rounds) {
            return parseInt(rounds, 10);
        }

        return null;
    }

    /**
     * Returns the stance of the boxer, either orthodox or southpaw
     * @returns {string | null}
     */
    get stance(): Stance | null {
        const stance: string | void = this.parseProfileTableData(BoxrecProfileTable.stance);

        return stance ? stance as Stance : null;
    }

    /**
     * Returns a string on whether the boxer is suspended or not
     * @returns {string | null}
     */
    get suspended(): string | null {
        const el: Cheerio = this.$("body").find(".profileTable div:contains('suspended'):nth-child(1)");
        if (el.length) {
            return trimRemoveLineBreaks(el.text());
        }

        return null;
    }

    /**
     * Returns an array of belts that this boxer is currently holding
     * @returns {string[]}
     */
    get titlesHeld(): string[] {
        const titlesHeld: string | void = this.parseProfileTableData(BoxrecProfileTable.titlesHeld);

        if (titlesHeld) {
            const html: Cheerio = this.$(titlesHeld);
            const tmpThis: CheerioStatic = this.$;

            return html.find("a").map(function(this: Cheerio): string {
                let text: string = tmpThis(this).text();
                // on the Gennady Golovkin profile I found one belt had two spaces in the middle of it
                text = text.replace(/\s{2,}/g, " ");
                return text.trim();
            }).get();
        }

        return [];
    }

    /**
     * Returns if they are enrolled into VADA (Voluntary Anti-Doping Association)
     * @example // may return "enrolled"
     * @returns {string | null}
     */
    get vadacbp(): boolean {
        return !!this.parseProfileTableData(BoxrecProfileTable.vadacbp);
    }

    private parseRanking(): string | null {
        const rankings: Cheerio = this.$(`.profileTable table td a[href*="/en/ratings"]`);

        return rankings ? rankings.parent().html() : null;
    }

}
