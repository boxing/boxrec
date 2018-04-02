import {BoxrecBout, boxrecProfileTable} from "./boxrec.constants";
import {convertFractionsToNumber} from "../helpers";
import {BoxrecPageProfileBout} from "./boxrec.page.profile.bout";

const cheerio = require("cheerio");
let $: CheerioAPI;

/**
 * Parse a Boxrec Profile Page
 */
export class BoxrecPageProfile {

    private _name: string | null;

    // profileTable
    private _globalId: string;
    private _role: string;
    private _rating: string;
    private _ranking: string;
    private _vadacbp: string;
    private _bouts: string;
    private _rounds: string;
    private _KOs: string;
    private _status: string;
    private _titlesHeld: string;
    private _birthName: string;
    private _alias: string;
    private _born: string;
    private _nationality: string;
    private _debut: string;
    private _division: string;
    private _height: string;
    private _reach: string;
    private _residence: string;
    private _birthPlace: string;
    private _stance: string;

    // other stuff we found that we haven't seen yet
    private _otherInfo: [string, string][] = [];

    private _boutsList: [string, string | null][] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseName();
        this.parseProfileTableData();
        this.parseBouts();
    }

    get name(): string | null {
        return this._name || null;
    }

    set name(name: string | null) {
        this._name = name;
    }

    get globalId(): number | null {
        const globalId: number = parseInt(this._globalId, 10);

        if (!isNaN(globalId)) {
            return globalId;
        }

        return null;
    }

    get role(): string | null {
        const role = $(this._role).text(); // todo if boxer is promoter as well, should return promoter link

        if (role) {
            return role;
        }

        return null;
    }

    get rating(): number | null {
        const html = $(this._rating);

        if (html.get(0)) {
            const widthString: string = html.get(0).attribs.style;
            // this uses pixels, where the others use percentage
            const regex = /width\:(\d+)px\;/;
            const matches = widthString.match(regex);

            if (matches && matches[1]) {
                return parseInt(matches[1], 10);
            }
        }

        return null;
    }

    get ranking(): number[][] | null {
        if (this._ranking) {
            const html = $(this._ranking);
            const links: string[] = html.get().filter((item: any) => item.name === "a");

            return links.map((item: any) => {
                const child: string = item.children[0].data;
                const rankArr: number[] = child.trim().replace(",", "").split("/")
                    .map(rank => parseInt(rank, 10));

                return [rankArr[0], rankArr[1]];
            });
        }

        return null;
    }

    get vadacbp(): string | null {
        if (this._vadacbp) {
            return this._vadacbp;
        }

        return null;
    }

    get numberOfBouts(): number {
        const bouts = parseInt(this._bouts, 10);
         return !isNaN(bouts) ? bouts : 0;
    }

    get rounds(): number | null {
        const rounds: number = parseInt(this._rounds, 10);

        if (!isNaN(rounds)) {
            return rounds;
        }

        return null;
    }

    get KOs(): number | null {
        const kos: number = parseInt(this._KOs, 10);

        if (!isNaN(kos)) {
            return kos;
        }

        return null;
    }

    get status(): string | null {
        if (this._status) {
            return this._status;
        }

        return null;
    }

    get titlesHeld(): string[] | null {
        if (this._titlesHeld) {
            const html = $(this._titlesHeld);

            return html.find("a").map(function (this: any) {
                let text: string = $(this).text();
                // on the Gennady Golovkin profile I found one belt had two spaces in the middle of it
                text = text.replace(/\s{2,}/g, " ");
                return text.trim();
            }).get();
        }

        return null;
    }

    get birthName(): string | null {
        if (this._birthName) {
            return this._birthName;
        }

        return null;
    }

    get alias(): string | null {
        if (this._alias) {
            return this._alias;
        }

        return null;
    }

    get born(): string | null {
        if (this._born) {
            // some boxers have dob and age.  Match the YYYY-MM-DD
            const regex = /(\d{4}\-\d{2}\-\d{2})/;
            const born = this._born.match(regex);

            if (born) {
                return born[1];
            }
        }

        return null;
    }

    get nationality(): string | null {
        if (this._nationality) {
            return $(this._nationality).text().trimLeft();
        }

        return null;
    }

    get debut(): string | null {
        if (this._debut) {
            return this._debut;
        }

        return null;
    }

    get division(): string | null {
        if (this._division) {
            return this._division;
        }

        return null;
    }

    get height(): number[] | null {
        let height: number[] | null = null;
        if (this._height) {
            const regex: RegExp = /^(\d)\&\#x2032\;\s(\d{1,2})(\&\#xB[CDE]\;)?\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const heightMatch = this._height.match(regex);

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

    get reach(): number[] | null {
        let reach: number[] | null = null;
        if (this._reach) {
            const regex: RegExp = /^(\d{2})\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const reachMatch: RegExpMatchArray | null = this._reach.match(regex);

            if (reachMatch) {
                const [, inches, centimeters]: string[] = reachMatch;
                reach = [
                    parseInt(inches, 10),
                    parseInt(centimeters, 10),
                ];
            }
        }

        return reach;
    }

    // todo can this be converted to return Location?
    get residence(): string | null {
        const residence: string = $(this._residence).text();

        if (residence) {
            return residence;
        }

        return null;
    }

    get birthPlace(): string | null {
        const birthPlace: string = $(this._birthPlace).text();

        if (birthPlace) {
            return birthPlace;
        }

        return null;
    }

    get stance(): string | null {
        if (this._stance) {
            return this._stance;
        }

        return null;
    }

    get otherInfo(): string[][] | null {
        if (this._otherInfo) {
            return this._otherInfo;
        }

        return null;
    }

    get bouts(): BoxrecBout[] {
        const bouts = this._boutsList;
        let boutsList: BoxrecBout[] = [];
        bouts.forEach((val: [string, string | null]) => {
            const bout: BoxrecBout = new BoxrecPageProfileBout(val[0], val[1]).get;
            boutsList.push(bout);
        });

        return boutsList;
    }

    get hasBoutScheduled(): boolean {
        return this.bouts.length > this.numberOfBouts;
    }

    private parseName(): void {
        this.name = $("h1").text();
    }

    private parseProfileTableData(): void {
        const tr = $(".profileTable table.rowTable tbody tr");

        tr.each((i: number, elem: CheerioElement) => {
            let key: string | null = $(elem).find("td:nth-child(1)").text();
            let val: string | null = $(elem).find("td:nth-child(2)").html();

            if (key && val) {
                key = key.trim();
                val = val.trim();
                const enumVals: any[] = Object.keys(boxrecProfileTable);
                const enumKeys: any[] = enumVals.map(k => boxrecProfileTable[k]);

                if (enumKeys.includes(key)) {
                    const idx: number = enumKeys.findIndex(item => item === key);
                    const classKey: string = `_${enumVals[idx]}`;
                    // the following line works but there is probably a probably a much better way with Typescript
                    (this as any)[classKey] = val; // set the private var related to this, note: this doesn't consider if there is a setter
                } else {
                    // either an error or returned something we haven't mapped
                    this._otherInfo.push([key, val]);
                }
            }
        });
    }

    private parseBouts(): void {
        const tr = $("#listBoutsResults\\, tbody tr");

        tr.each((i: number, elem: CheerioElement) => {

            const boutId: string = $(elem).attr("id");

            // skip rows that are associated with the previous fight
            if (boutId.includes("second")) {
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
            this._boutsList.push([html, next]);
        });
    }

}

module.exports = BoxrecPageProfile;
