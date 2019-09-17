import * as cheerio from "cheerio";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {changeToCamelCase, trimRemoveLineBreaks} from "../../helpers";
import {
    BoxrecBelts,
    BoxrecChampion,
    BoxrecChampionsByWeightDivision,
    BoxrecChampionsOutput,
    BoxrecUnformattedChampions
} from "./boxrec.champions.constants";

const beltOrganizations: BoxrecBelts = {
    BoxRec: null,
    IBF: null,
    IBO: null,
    WBA: null,
    WBC: null,
    WBO: null,
};

const weightDivisions: BoxrecChampionsByWeightDivision = {
    bantamweight: beltOrganizations,
    cruiserweight: beltOrganizations,
    featherWeight: beltOrganizations,
    flyweight: beltOrganizations,
    heavyweight: beltOrganizations,
    lightFlyweight: beltOrganizations,
    lightHeavyweight: beltOrganizations,
    lightweight: beltOrganizations,
    middleweight: beltOrganizations,
    minimumweight: beltOrganizations,
    superBantamweight: beltOrganizations,
    superFeatherweight: beltOrganizations,
    superFlyweight: beltOrganizations,
    superLightweight: beltOrganizations,
    superMiddleweight: beltOrganizations,
    superWelterweight: beltOrganizations,
    welterweight: beltOrganizations,
};

export class BoxrecPageChampions {

    private readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxingOrganizations(): string[] {
        return this.parseBoxingOrganizations();
    }

    get byWeightDivision(): BoxrecChampionsByWeightDivision {
        const championsFormatted: BoxrecChampionsByWeightDivision = weightDivisions;
        const champions: BoxrecUnformattedChampions[] = this.parseChampions();

        for (const weightDivision of champions) {
            if (weightDivision.weightDivision) {
                const weightDivisionFormatted: string = changeToCamelCase(weightDivision.weightDivision);
                (championsFormatted as any)[weightDivisionFormatted] = weightDivision.beltHolders;
            }
        }

        return championsFormatted;
    }

    get champions(): BoxrecUnformattedChampions[] {
        return this.parseChampions();
    }

    get output(): BoxrecChampionsOutput {
        return {
            boxingOrganizations: this.boxingOrganizations,
            byWeightDivision: this.byWeightDivision,
            champions: this.champions,
        };
    }

    private parseBoxingOrganizations(): string[] {
        const listOfBoxingOrganizations: string[] = [];
        // find the first `BoxRec` and get the siblings of it.  The table structure keeps changing
        this.$(".dataTable th:contains(BoxRec)").first().siblings()
            .each((index: number, elem: CheerioElement) => {
                let boxingOrganization: string = this.$(elem).text();
                boxingOrganization = boxingOrganization.trim();

                if (boxingOrganization.length > 0) {
                    listOfBoxingOrganizations.push(boxingOrganization);
                }
            });

        if (listOfBoxingOrganizations.length) {
            listOfBoxingOrganizations.unshift("BoxRec");
        }

        return listOfBoxingOrganizations;
    }

    private parseChampions(): BoxrecUnformattedChampions[] {
        const champions: BoxrecUnformattedChampions[] = [];
        const listOfBoxingOrganizations: string[] = this.parseBoxingOrganizations();

        // todo develop more flexible way to get the champions, this is bound to change when they change their tables
        this.$(".dataTable tr:nth-child(4n+3)").each((index: number, elem: CheerioElement) => {
            const weightDivision: string = this.$(elem).prev().prev().find("td:nth-child(1)").text();

            champions.push({
                beltHolders: Object.assign({}, beltOrganizations),
                weightDivision: BoxrecCommonTablesColumnsClass.parseDivision(weightDivision),
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
                                    (champions as any)[last]
                                        .beltHolders[listOfBoxingOrganizations[tdIndex - 1]] = boxer;
                                }
                            }
                        }
                    }
                }
            });

        });

        return champions;
    }

}
