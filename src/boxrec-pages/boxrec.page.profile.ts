import {boxrecProfileTable} from "./boxrec.constants";
const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageProfile {

    private _name: string;

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

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseName();
        this.parseProfileTableData();
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get globalId(): number | void {
        const globalId: number = parseInt(this._globalId, 10);

        if (!isNaN(globalId)) {
            return globalId;
        }
    }

    get role(): string | void {
        const role = $(this._role).text(); // todo if boxer is promoter as well, should return promoter link

        if (role) {
            return role;
        }
    }

    get rating(): number | void {
        const html = $(this._rating);

        if (html.get(0)) {
            const widthString = html.get(0).attribs.style;
            const regex = /width\:(\d+)px\;/;
            const widthMatch = widthString.match(regex);
            return parseInt(widthMatch[1], 10);
        }
    }

    get ranking(): [number, number][] | void {
        if (this._ranking) {
            const html = $(this._ranking);
            const links: Cheerio = html.get().filter((item: CheerioElement[]) => item.name === "a");

            return links.map((item: CheerioElement) => {
                const rank: [string][string][] = item.children[0].data.trim().replace(",", "").split("/");
                return [parseInt(rank[0], 10), parseInt(rank[1], 10)];
            });
        }
    }

    get vadacbp(): string | void {
        return this._vadacbp;
    }

    get bouts(): number | void {
        const bouts: number = parseInt(this._bouts, 10);

        if (!isNaN(bouts)) {
            return bouts;
        }
    }

    get rounds(): number | void {
        const rounds: number = parseInt(this._rounds, 10);

        if (!isNaN(rounds)) {
            return rounds;
        }
    }

    get KOs(): number | void {
        const kos: number = parseInt(this._KOs, 10);

        if (!isNaN(kos)) {
            return kos;
        }
    }

    get status(): string | void {
        return this._status;
    }

    get titlesHeld(): string[] | void {
        if (this._titlesHeld) {
            const html = $(this._titlesHeld);

            return html.find("a").map(function () {
                return $(this).text();
            }).get();
        }
    }

    get birthName(): string | void {
        return this._birthName;
    }

    get alias(): string | void {
        return this._alias;
    }

    get born(): string | void {
        if (this._born) {
            // some boxers have dob and age.  Match the YYYY-MM-DD
            const regex = /(\d{4}\-\d{2}\-\d{2})/;
            const born = this._born.match(regex);

            if (born) {
                return born[1];
            }
        }
    }

    get nationality(): string | void {
        if (this._nationality) {
            return $(this._nationality).text().trimLeft();
        }
    }

    get debut(): string | void {
        return this._debut;
    }

    get division(): string | void {
        return this._division;
    }

    get height(): number[] | void {
        if (this._height) {
            const regex: RegExp = /^(\d)\&\#x2032\;\s(\d{1,2})(\&\#xB[CDE]\;)?\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const height = this._height.match(regex);

            if (height) {
                let [, imperialFeet, imperialInches, fractionInches, metric] = height;

                imperialInches = parseInt(imperialInches, 10);

                switch (fractionInches) {
                    case "&#xBC;":
                        imperialInches += .25;
                        break;
                    case "&#xBD;":
                        imperialInches += .5;
                        break;
                    case "&#xBE;":
                        imperialInches += .75;
                        break;
                }

                return [
                    parseInt(imperialFeet, 10),
                    imperialInches,
                    parseInt(metric, 10)
                ];
            }
        }

    }

    get reach(): number[] | void {
        if (this._reach) {
            const regex: RegExp = /^(\d{2})\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            const reach = this._reach.match(regex);

            if (reach) {
                const [, inches, centimeters]: string[] = reach;
                return [
                    parseInt(inches, 10),
                    parseInt(centimeters, 10),
                ]
            }
        }
    }

    get residence(): string | void {
        const residence: string = $(this._residence).text();

        if (residence) {
            return residence;
        }
    }

    get birthPlace(): string | void {
        const birthPlace: string = $(this._birthPlace).text();

        if (birthPlace) {
            return birthPlace;
        }
    }

    get stance(): string | void {
        return this._stance;
    }

    get otherInfo(): [string, string][] | void {
        return this._otherInfo;
    }

    private parseName() {
        const name: string = $('h1').text();

        if (name) {
            this.name = name;
        }
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
                const enumKeys: any[] = enumVals.map(key => boxrecProfileTable[key]);

                if (enumKeys.includes(key)) {
                    const idx: number = enumKeys.findIndex(item => item === key);
                    // tslint:disable-next-line
                    this[`_${enumVals[idx]}`] = val; // set the private var related to this, note: this doesn't consider if there is a setter
                } else {
                    // either an error or returned something we haven't mapped
                    this._otherInfo.push([key, val]);
                }

            }
        });
    }

}

module.exports = BoxrecPageProfile;
