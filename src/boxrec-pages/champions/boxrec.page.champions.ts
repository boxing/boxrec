import {BoxrecChampionsOutput} from "@boxrec-pages/champions/boxrec.champions.constants";
import {changeToCamelCase, trimRemoveLineBreaks} from "@helpers";
import * as cheerio from "cheerio";
import {
    BoxrecBelts,
    BoxrecChampion,
    BoxrecChampionsByWeightDivision,
    BoxrecUnformattedChampions,
    WeightDivision
} from "./boxrec.champions.constants";

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

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxingOrganizations(): string[] {
        return this.parseBoxingOrganizations();
    }

    get champions(): BoxrecUnformattedChampions[] {
        return this.parseChampions();
    }

    get output(): BoxrecChampionsOutput {
        return {
            boxingOrganizations: this.boxingOrganizations,
            champions: this.champions,
            byWeightDivision: this.byWeightDivision,
        };
    }

    get byWeightDivision(): BoxrecChampionsByWeightDivision {
        const championsFormatted: BoxrecChampionsByWeightDivision = weightDivisions;
        const champions: BoxrecUnformattedChampions[] = this.parseChampions();

        for (const weightDivision of champions) {
            const weightDivisionFormatted: string = changeToCamelCase(weightDivision.weightDivision);
            (championsFormatted as any)[weightDivisionFormatted] = weightDivision.beltHolders;
        }

        return championsFormatted;
    }

    private parseBoxingOrganizations(): string[] {
        const listOfBoxingOrganizations: string[] = [];
        this.$(".dataTable tr:nth-child(1) th").each((index: number, elem: CheerioElement) => {
            let boxingOrganization: string = this.$(elem).text();
            boxingOrganization = boxingOrganization.trim();

            if (boxingOrganization.length > 0) {
                listOfBoxingOrganizations.push(boxingOrganization);
            }
        });

        return listOfBoxingOrganizations;
    }

    private parseChampions(): BoxrecUnformattedChampions[] {
        const champions: BoxrecUnformattedChampions[] = [];
        const listOfBoxingOrganizations: string[] = this.parseBoxingOrganizations();

        this.$(".dataTable tr").each((index: number, elem: CheerioElement) => {
            // the first row is the list of belt name
            // the second part of this is that there are empty table rows between weight classes
            if (index !== 0 && index % 2 !== 0) {
                const weightDivision: string = this.$(elem).find("td:nth-child(1)").text();

                champions.push({
                    beltHolders: Object.assign({}, beltOrganizations),
                    weightDivision: weightDivision as WeightDivision,
                });
                const last: number = champions.length - 1;

                this.$(elem).find("td").each((tdIndex: number, tdElem: CheerioElement) => {
                    if (tdIndex !== 0) {
                        const boxer: BoxrecChampion | null = {
                            id: null,
                            name: null,
                            picture: null,
                        };
                        const firstLink: Cheerio = this.$(tdElem).find("a:nth-child(1)");

                        if (firstLink.length) {
                            let name: string | null = this.$(tdElem).html();

                            if (name) {
                                name = name.replace("<br>", " ");
                                name = this.$(name).text();
                                name = trimRemoveLineBreaks(name);

                                if (firstLink[0] && firstLink[0].attribs) {
                                    const href: RegExpMatchArray | null = firstLink[0].attribs.href.match(/(\d+)$/);
                                    const picture: string = this.$(tdElem).find("img").attr("src");

                                    if (href && href[1]) {
                                        boxer.id = parseInt(href[1], 10);
                                        boxer.name = name;
                                        boxer.picture = picture;
                                        (champions as any)[last].beltHolders[listOfBoxingOrganizations[tdIndex - 1]] = boxer;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });

        return champions;
    }
}
