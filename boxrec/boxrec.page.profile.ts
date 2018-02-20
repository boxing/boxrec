const cheerio = require("cheerio");
let $: CheerioAPI;

enum boxProfile {
    globalID = "global ID",
    role = "role",
    bouts = "bouts",
    rounds = "rounds",
    KOs = "KOs",
    status = "status",
    birthName = "birth name",
    alias = "alias",
    born = "born",
    nationality = "nationality",
    debut = "debut",
    division = "division",
    height = "height",
    reach = "reach",
    residence = "residence",
    birthPlace = "birth place",
}

export class BoxrecPageProfile {

    private _globalID: number;
    private _role: string;
    private _bouts: number;
    private _rounds: number;
    private _KOs: number;
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

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parseProfileTableData();
    }

    get name() {
        return $('h1').text();
    }

    get bouts() {
        return this._bouts;
    }

    get globalID() {
        return this._globalID;
    }

    get role() {
        return this._role;
    }

    get rounds() {
        return this._rounds;
    }

    get KOs() {
        return this._KOs;
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
        return this._born;
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

    get height() {
        return this._height;
    }

    get reach() {
        return this._reach;
    }

    get residence() {
        return this._residence;
    }

    get birthPlace() {
        return this._birthPlace;
    }

    private parseProfileTableData() {
        const tr = $(".profileTable table.rowTable tbody tr");

        const enumVals: any[] = Object.keys(boxProfile);
        const enumKeys: any[] = enumVals.map(key => boxProfile[key]);

        tr.each((i: number, elem: CheerioElement) => {
            let key: string = $(elem).find("td:nth-child(1)").text();
            let val: string = $(elem).find("td:nth-child(2)").text();

            key = key.trim();
            val = val.trim();

            if (key !== "" && key !== null) {
                if (enumKeys.includes(key)) {

                    const idx: number = enumKeys.findIndex(item => item === key);

                    if (idx !== -1) {
                        // todo index signature or union type
                        this[`_${enumVals[idx]}`] = val; // set the private var related to this, note: this doesn't consider if there is a setter
                    }
                } else {
                    // either an error or returned something we haven't mapped
                    // todo we should have these available as well someway
                }
            }
        });
    }
}

module.exports = BoxrecPageProfile;
