import {changeToCamelCase, trimRemoveLineBreaks} from "../../helpers";
import {
    BoxrecBelts,
    BoxrecChampionsByWeightDivision,
    BoxrecUnformattedChampions,
    WeightDivision
} from "./boxrec.champions.constants";
import {BoxrecBasic} from "../boxrec.constants";

const cheerio: CheerioAPI = require("cheerio");
let $: CheerioStatic;

const beltOrganizations: BoxrecBelts = {
    BoxRec: null,
    WBC: null,
    IBO: null,
    WBO: null,
    IBF: null,
    WBA: null,
};

const weightDivisions: BoxrecChampionsByWeightDivision = {
    heavyweight: beltOrganizations,
    cruiserweight: beltOrganizations,
    lightHeavyweight: beltOrganizations,
    superMiddleweight: beltOrganizations,
    middleweight: beltOrganizations,
    superWelterweight: beltOrganizations,
    welterweight: beltOrganizations,
    superLightweight: beltOrganizations,
    lightweight: beltOrganizations,
    superFeatherweight: beltOrganizations,
    featherWeight: beltOrganizations,
    superBantamweight: beltOrganizations,
    bantamweight: beltOrganizations,
    superFlyweight: beltOrganizations,
    flyweight: beltOrganizations,
    lightFlyweight: beltOrganizations,
    minimumweight: beltOrganizations,
};

export class BoxrecPageChampions {

    private _champions: BoxrecUnformattedChampions[] = [];
    private _listOfBoxingOrganizations: string[] = [];

    constructor(boxrecBodyString: string) {
        $ = cheerio.load(boxrecBodyString);
        this.parse();
    }

    get champions(): BoxrecUnformattedChampions[] {
        return this._champions;
    }

    getByWeightDivision(): BoxrecChampionsByWeightDivision {
        const championsFormatted: BoxrecChampionsByWeightDivision = weightDivisions;
        const champions: BoxrecUnformattedChampions[] = this.champions;

        for (const weightDivision of champions) {
            const weightDivisionFormatted: string = changeToCamelCase(weightDivision.weightDivision);
            (championsFormatted as any)[weightDivisionFormatted] = weightDivision.beltHolders;
        }

        return championsFormatted;
    }

    get boxingOrganizations(): string[] {
        return this._listOfBoxingOrganizations;
    }

    private parse(): void {
        const obj: BoxrecUnformattedChampions[] = [];
        const listOfBoxingOrganizations: string[] = [];

        $(".dataTable tr:nth-child(1) th").each((index: number, elem: CheerioElement) => {
            let boxingOrganization: string = $(elem).text();
            boxingOrganization = boxingOrganization.trim();

            if (boxingOrganization.length > 0) {
                listOfBoxingOrganizations.push(boxingOrganization);
            }
        });

        this._listOfBoxingOrganizations = listOfBoxingOrganizations;

        $(".dataTable tr").each((index: number, elem: CheerioElement) => {
            // the first row is the list of belt name
            // the second part of this is that there are empty table rows between weight classes
            if (index !== 0 && index % 2 !== 0) {
                const weightDivision: string = $(elem).find("td:nth-child(1)").text();

                obj.push({
                    weightDivision: weightDivision as WeightDivision,
                    beltHolders: Object.assign({}, beltOrganizations),
                });
                const last: number = obj.length - 1;

                $(elem).find("td").each((tdIndex: number, tdElem: CheerioElement) => {
                    if (tdIndex !== 0) {
                        const boxer: BoxrecBasic | null = {
                            id: null,
                            name: null,
                        };
                        const firstLink: Cheerio = $(tdElem).find("a:nth-child(1)");

                        if (firstLink.length) {
                            let name: string | null = $(tdElem).html();

                            if (name) {
                                name = name.replace("<br>", " ");
                                name = $(name).text();
                                name = trimRemoveLineBreaks(name);

                                if (firstLink[0] && firstLink[0].attribs) {
                                    const href: RegExpMatchArray | null = firstLink[0].attribs.href.match(/(\d+)$/);

                                    if (href && href[1]) {
                                        boxer.id = parseInt(href[1], 10);
                                        boxer.name = name;

                                        (obj as any)[last].beltHolders[listOfBoxingOrganizations[tdIndex - 1]] = boxer;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
        this._champions = obj;
    }
}
