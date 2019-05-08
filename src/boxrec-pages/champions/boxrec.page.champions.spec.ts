import {mockChampions} from "boxrec-mocks";
import {
    BoxrecChampionsByWeightDivision,
    BoxrecChampionsOutput,
    BoxrecUnformattedChampions
} from "./boxrec.champions.constants";
import {BoxrecPageChampions} from "./boxrec.page.champions";

interface ExtendedMatchers extends jest.Matchers<void> {
    toBeCDNLinkOrNull: () => () => boolean;
}

expect.extend({
    toBeCDNLinkOrNull(received: string | null): { message: () => string, pass: boolean } {
        if ((received && received.includes("http://static.boxrec.com/thumb")) || received === null) {
            return {
                message: () => "is valid",
                pass: true,
            };
        }

        return {
            message: () => "is not valid",
            pass: false,
        };
    }
});

describe("class BoxrecPageChampions", () => {

    let champions: BoxrecChampionsOutput;

    beforeAll(() => {
        champions = new BoxrecPageChampions(mockChampions).output;
    });

    describe("getter champions", () => {

        let list: BoxrecUnformattedChampions[];

        beforeAll(() => {
            list = champions.champions;
        });

        it("first array should be for heavyweights", () => {
            expect(list[0].weightDivision).toBe("heavyweight");
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

    describe("method byWeightDivision", () => {

        let list: BoxrecChampionsByWeightDivision;

        beforeAll(() => {
            list = champions.byWeightDivision;
        });

        it("should return as object with weight classes", () => {
            expect(list.heavyweight).toBeDefined();
        });

        it("weight classes should be camel case", () => {
            expect(list.superBantamweight).toBeDefined();
        });

        it("should have a picture of the belt holder", () => {
            for (const heavyweightKey in list.heavyweight) {
                if ((list.heavyweight as any)[heavyweightKey]) {
                    (expect((list.heavyweight as any)[heavyweightKey].picture) as ExtendedMatchers).toBeCDNLinkOrNull();
                }
            }
        });

        it("should return `null` for vacant belts", () => {
            jest.spyOn(BoxrecPageChampions.prototype, "output", "get").mockReturnValue({
                byWeightDivision: {
                    superMiddleweight: {
                        IBO: null,
                    },
                },
            });

            list = new BoxrecPageChampions(mockChampions).output.byWeightDivision;
            expect(list.superMiddleweight.IBO).toBeNull();
        });

    });

});
