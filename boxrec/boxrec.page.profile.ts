import {boxrecProfileTable} from "./boxrec.constants";
const cheerio = require("cheerio");
let $: CheerioAPI;

export class BoxrecPageProfile {

    private _name: string;

    // profileTable
    private _globalId: string;
    private _role: string;
    private _bouts: string;
    private _rounds: string;
    private _KOs: string;
    private _status: string;
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
    private _vadacbp: string;

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

    get bouts(): number {
        return parseInt(this._bouts, 10);
    }

    get globalId(): number {
        return parseInt(this._globalId, 10);
    }

    get role() {
        return this._role;
    }

    get rounds(): number {
        return parseInt(this._rounds, 10);
    }

    get KOs(): number {
        return parseInt(this._KOs, 10);
    }

    get status() {
        return this._status;
    }

    get birthName() {
        return this._birthName;
    }

    get alias() {
        return this._alias;
    }

    get born() {
        // some boxers have dob and age.  Match the YYYY-MM-DD
        const regex = /^(\d{4}\-\d{2}\-\d{2})/;
        const born: RegExpMatchArray = this._born.match(regex);

        if (born) {
            return born;
        } else {
            return this._born;
        }
    }

    get nationality() {
        return this._nationality;
    }

    get debut() {
        return this._debut;
    }

    get division() {
        return this._division;
    }

    get height(): number[] {
        const regex: RegExp = /(\d{1})\′\s(\d{1,2})\″\s{3}\/\s{3}(\d{3})cm/;
        const height: RegExpMatchArray = this._height.match(regex);
        const [, imperialFeet, imperialInches, metric]: string[] = height;
        return [
            parseInt(imperialFeet, 10),
            parseInt(imperialInches, 10),
            parseInt(metric, 10),
        ];
    }

    get reach(): number[] {
        const regex: RegExp = /^(\d{2})\″\s{3}\/\s{3}(\d{3})cm$/;
        const reach: RegExpMatchArray = this._reach.match(regex);
        const [, inches, centimeters]: string[] = reach;
        return [
            parseInt(inches, 10),
            parseInt(centimeters, 10),
        ]
    }

    get residence() {
        return this._residence;
    }

    get birthPlace() {
        return this._birthPlace;
    }

    get stance() {
        return this._stance;
    }

    get vadacbp() {
        return this._vadacbp;
    }

    get otherInfo(): [string, string][] {
        return this._otherInfo;
    }

    private parseName() {
        this.name = $('h1').text();
    }

    private parseProfileTableData(): void {
        const tr = $(".profileTable table.rowTable tbody tr");

        const enumVals: any[] = Object.keys(boxrecProfileTable);
        const enumKeys: any[] = enumVals.map(key => boxrecProfileTable[key]);

        tr.each((i: number, elem: CheerioElement) => {
            let key: string = $(elem).find("td:nth-child(1)").text();

            let val: string = $(elem).find("td:nth-child(2)").html();

            key = key.trim();
            val = val.trim();

            if (key !== "" && key !== null) {
                if (enumKeys.includes(key)) {
                    const idx: number = enumKeys.findIndex(item => item === key);
                    // todo index signature or union type
                    this[`_${enumVals[idx]}`] = val; // set the private var related to this, note: this doesn't consider if there is a setter
                } else {
                    // either an error or returned something we haven't mapped
                    this._otherInfo.push([key, val]);
                }
            }
        });
    }

    private getStarRating(html) {
        // <div style="width:98px;"><span class="starBaseLarge"><span class="starRatingLarge" style="width: 100%;"></span></span>
    }
}

module.exports = BoxrecPageProfile;
