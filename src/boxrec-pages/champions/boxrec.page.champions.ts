import {BoxrecBasic, BoxrecChampionsByWeightClass, BoxrecUnformattedChampions} from "../boxrec.constants";
import {changeToCamelCase, trimRemoveLineBreaks} from "../../helpers";

const cheerio = require("cheerio");
let $: CheerioAPI;


const beltOrganizations = {
    BoxRec: null,
    WBC: null,
    IBO: null,
    WBO: null,
    IBF: null,
    WBA: null,
};

const weightClasses = {
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

    getByWeightClass(): BoxrecChampionsByWeightClass {
        const championsFormatted: BoxrecChampionsByWeightClass = weightClasses;
        const champions: BoxrecUnformattedChampions[] = this.champions;

        for (const weightClass of champions) {
            const weightClassFormatted: string = changeToCamelCase(weightClass.weightClass);
            (championsFormatted as any)[weightClassFormatted] = weightClass.beltHolders;
        }

        return championsFormatted;
    }

    get boxingOrganizations(): string[] {
        return this._listOfBoxingOrganizations;
    }

    private parse() {
        let obj: BoxrecUnformattedChampions[] = [];
        let listOfBoxingOrganizations: string[] = [];

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
                const weightClass: string = $(elem).find("td:nth-child(1)").text();

                obj.push({
                    weightClass,
                    beltHolders: Object.assign({}, beltOrganizations),
                });
                const last = obj.length - 1;

                $(elem).find("td").each((tdIndex: number, tdElem: CheerioElement) => {
                    if (tdIndex !== 0) {
                        let boxer: BoxrecBasic | null = {
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
                                    const href = firstLink[0].attribs.href.match(/(\d+)$/);

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
