import {BoxrecChampionsByWeightClass, BoxrecUnformattedChampions} from "./boxrec.champions.constants";
import {boxRecMocksModulePath} from "../boxrec.constants";
import {BoxrecPageChampions} from "./boxrec.page.champions";

import * as fs from "fs";
const mockChampions: string = fs.readFileSync(`${boxRecMocksModulePath}/champions/mockChampions.html`, "utf8");

describe("class BoxrecPageChampions", () => {

    let champions: BoxrecPageChampions;

    beforeAll(() => {
        champions = new BoxrecPageChampions(mockChampions);
    });

    describe("getter champions", () => {

        let list: BoxrecUnformattedChampions[];

        beforeAll(() => {
            list = champions.champions;
        });

        it("first array should be for heavyweights", () => {
            expect(list[0].weightClass).toBe("heavyweight");
        });

        it("beltHolders should be an object with all the belts", () => {
            expect(list[0].beltHolders.IBO).toBeDefined();
            expect(list[0].beltHolders.WBC).toBeDefined();
            expect(list[0].beltHolders.BoxRec).toBeDefined();
        });

    });

    describe("getter boxingOrganizations", () => {

        it("should return an array of boxing organizations", () => {
            expect(champions.boxingOrganizations).toContain("WBC");
            expect(champions.boxingOrganizations).toContain("IBF");
            expect(champions.boxingOrganizations).toContain("BoxRec");
        });

    });

    describe("method getByWeightClass", () => {

        let list: BoxrecChampionsByWeightClass;

        beforeAll(() => {
            list = champions.getByWeightClass();
        });

        it("should return as object with weight classes", () => {
            expect(list.heavyweight).toBeDefined();
        });

        it("weight classes should be camel case", () => {
            expect(list.superBantamweight).toBeDefined();
        });

        it("should list the belt holders", () => {
            expect(list.heavyweight.IBF).toEqual({
                id: 659461,
                name: "Anthony Joshua",
            });
        });

        it("should return `null` for vacant belts", () => {
            expect(list.superMiddleweight.IBO).toBeNull();
        });

    });

});
